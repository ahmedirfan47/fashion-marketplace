create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

alter table wishlist_items enable row level security;

create policy "wishlist_items_own" on wishlist_items for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create table brand_follows (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, brand_id)
);

alter table brand_follows enable row level security;

create policy "brand_follows_own" on brand_follows for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create table return_requests (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  brand_id uuid not null references brands(id),
  customer_id uuid not null references profiles(id),
  reason text not null,
  status text not null default 'requested' check (status in ('requested','approved','rejected','refunded')),
  refund_amount numeric(10,2),
  requested_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index on return_requests (order_item_id);
create index on return_requests (brand_id);

alter table return_requests enable row level security;

create policy "return_requests_customer_read" on return_requests for select using (customer_id = auth.uid());
create policy "return_requests_customer_insert" on return_requests for insert with check (customer_id = auth.uid());
create policy "return_requests_seller_read" on return_requests for select using (
  exists (select 1 from brand_members where brand_id = return_requests.brand_id and user_id = auth.uid())
);
create policy "return_requests_seller_update" on return_requests for update using (
  exists (select 1 from brand_members where brand_id = return_requests.brand_id and user_id = auth.uid())
);