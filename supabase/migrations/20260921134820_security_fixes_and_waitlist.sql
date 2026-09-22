-- ===== Atomic order placement: fixes stock never decrementing, and closes the
-- price/commission tampering gap by computing everything server-side inside
-- one locked transaction instead of trusting multiple separate client calls =====
create or replace function public.place_order(
  p_items jsonb,
  p_shipping_address jsonb,
  p_payment_method text,
  p_discount_code text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_item jsonb;
  v_variant record;
  v_subtotal numeric(10,2) := 0;
  v_discount_amount numeric(10,2) := 0;
  v_total numeric(10,2);
  v_order_id uuid;
  v_discount record;
  v_line_total numeric(10,2);
  v_commission_amount numeric(10,2);
  v_updated_rows int;
begin
  if v_customer_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty.';
  end if;

  insert into orders (customer_id, status, subtotal, total, payment_method, payment_status, shipping_address)
  values (v_customer_id, 'pending', 0, 0, p_payment_method, 'unpaid', p_shipping_address)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select pv.id, pv.stock_quantity, pv.price_override, p.base_price, p.brand_id, b.commission_rate
      into v_variant
      from product_variants pv
      join products p on p.id = pv.product_id
      join brands b on b.id = p.brand_id
      where pv.id = (v_item->>'variantId')::uuid
      for update of pv;

    if not found then
      raise exception 'One of the items could not be found.';
    end if;

    update product_variants
      set stock_quantity = stock_quantity - (v_item->>'quantity')::int
      where id = v_variant.id and stock_quantity >= (v_item->>'quantity')::int;

    get diagnostics v_updated_rows = row_count;
    if v_updated_rows = 0 then
      raise exception 'Not enough stock for one of the items.';
    end if;

    v_line_total := coalesce(v_variant.price_override, v_variant.base_price) * (v_item->>'quantity')::int;
    v_commission_amount := round(v_line_total * coalesce(v_variant.commission_rate, 0) / 100, 2);
    v_subtotal := v_subtotal + v_line_total;

    insert into order_items (order_id, product_variant_id, brand_id, quantity, unit_price, commission_rate, commission_amount)
    values (
      v_order_id,
      v_variant.id,
      v_variant.brand_id,
      (v_item->>'quantity')::int,
      coalesce(v_variant.price_override, v_variant.base_price),
      coalesce(v_variant.commission_rate, 0),
      v_commission_amount
    );
  end loop;

  if p_discount_code is not null and length(trim(p_discount_code)) > 0 then
    select * into v_discount from discounts
      where code = upper(trim(p_discount_code)) and active = true
        and (starts_at is null or starts_at <= now())
        and (ends_at is null or ends_at >= now());

    if not found then
      raise exception 'That code is not valid.';
    end if;

    if v_discount.discount_type = 'percentage' then
      v_discount_amount := round(v_subtotal * v_discount.value / 100, 2);
    else
      v_discount_amount := least(v_discount.value, v_subtotal);
    end if;
  end if;

  v_total := v_subtotal - v_discount_amount;

  update orders
    set subtotal = v_subtotal,
        total = v_total,
        discount_amount = v_discount_amount,
        discount_code = case when p_discount_code is not null and length(trim(p_discount_code)) > 0
                              then upper(trim(p_discount_code)) else null end
    where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.place_order(jsonb, jsonb, text, text) to authenticated;

-- ===== Prevent sellers from changing their own brand's status or commission rate =====
create or replace function public.protect_brand_sensitive_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.status is distinct from old.status or new.commission_rate is distinct from old.commission_rate) then
    if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
      raise exception 'Only an admin can change brand status or commission rate.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists brands_protect_sensitive_fields on brands;
create trigger brands_protect_sensitive_fields
before update on brands
for each row execute function public.protect_brand_sensitive_fields();

-- ===== Prevent sellers from rewriting price/commission on their own order lines =====
create or replace function public.protect_order_item_financial_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    new.unit_price is distinct from old.unit_price or
    new.commission_rate is distinct from old.commission_rate or
    new.commission_amount is distinct from old.commission_amount or
    new.quantity is distinct from old.quantity or
    new.brand_id is distinct from old.brand_id or
    new.product_variant_id is distinct from old.product_variant_id or
    new.order_id is distinct from old.order_id
  ) then
    if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
      raise exception 'This field cannot be changed.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists order_items_protect_financial_fields on order_items;
create trigger order_items_protect_financial_fields
before update on order_items
for each row execute function public.protect_order_item_financial_fields();

-- ===== Close the ad campaign self-approval gap =====
drop policy if exists "ad_campaigns_seller_manage" on ad_campaigns;

create policy "ad_campaigns_seller_select" on ad_campaigns for select using (
  exists (select 1 from brand_members where brand_id = ad_campaigns.brand_id and user_id = auth.uid())
);

create policy "ad_campaigns_seller_insert" on ad_campaigns for insert with check (
  status = 'pending'
  and exists (select 1 from brand_members where brand_id = ad_campaigns.brand_id and user_id = auth.uid())
);

-- ===== Waiting list =====
create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table waitlist_signups enable row level security;

create policy "waitlist_public_insert" on waitlist_signups for insert with check (true);

create policy "waitlist_admin_read" on waitlist_signups for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);