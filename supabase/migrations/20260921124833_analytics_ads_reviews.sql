-- product view tracking (anonymous, for seller analytics)
create table product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index on product_views (brand_id, created_at);
create index on product_views (product_id);

alter table product_views enable row level security;

create policy "product_views_public_insert" on product_views for insert with check (true);

create policy "product_views_seller_read" on product_views for select using (
  exists (select 1 from brand_members where brand_id = product_views.brand_id and user_id = auth.uid())
);

-- sponsored placement (ads)
create table ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  starts_at date not null,
  ends_at date not null,
  daily_budget numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','completed')),
  created_at timestamptz not null default now()
);

create index on ad_campaigns (brand_id);

alter table ad_campaigns enable row level security;

create policy "ad_campaigns_seller_manage" on ad_campaigns for all using (
  exists (select 1 from brand_members where brand_id = ad_campaigns.brand_id and user_id = auth.uid())
);

create policy "ad_campaigns_admin_all" on ad_campaigns for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "ad_campaigns_public_read_approved" on ad_campaigns for select using (
  status = 'approved' and current_date between starts_at and ends_at
);

-- reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid not null references profiles(id) on delete cascade,
  order_item_id uuid not null references order_items(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create index on reviews (product_id);

alter table reviews enable row level security;

create policy "reviews_public_read" on reviews for select using (true);

create policy "reviews_customer_insert" on reviews for insert with check (
  customer_id = auth.uid()
  and exists (
    select 1 from order_items oi join orders o on o.id = oi.order_id
    where oi.id = order_item_id and o.customer_id = auth.uid() and oi.fulfillment_status = 'delivered'
  )
);

create policy "reviews_owner_delete" on reviews for delete using (customer_id = auth.uid());

create policy "reviews_admin_delete" on reviews for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);