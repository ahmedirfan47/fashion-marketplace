-- Enums
create type user_role as enum ('customer', 'seller', 'admin');
create type brand_status as enum ('pending', 'active', 'suspended');
create type product_status as enum ('draft', 'active', 'archived');
create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type payout_status as enum ('draft', 'issued', 'paid');

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- Brands
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  commission_rate numeric(5,2) not null default 10.00,
  status brand_status not null default 'pending',
  contact_email text not null,
  created_at timestamptz not null default now()
);

-- Links sellers to the brand(s) they manage
create table brand_members (
  brand_id uuid not null references brands(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (brand_id, user_id)
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  category text not null,
  base_price numeric(10,2) not null,
  status product_status not null default 'draft',
  source text not null default 'manual', -- manual | shopify | woocommerce | feed
  external_id text, -- id in the brand's own system, for sync matching
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, slug)
);

create index on products (brand_id);
create index on products (status);

-- Product variants (size/color/stock)
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null,
  size text,
  color text,
  price_override numeric(10,2),
  stock_quantity integer not null default 0,
  image_url text,
  unique (product_id, sku)
);

create index on product_variants (product_id);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id),
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  payment_method text,
  payment_status text not null default 'unpaid',
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create index on orders (customer_id);

-- Order items — one row per brand's product in an order
-- commission_rate and commission_amount are frozen at sale time
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_variant_id uuid not null references product_variants(id),
  brand_id uuid not null references brands(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  commission_rate numeric(5,2) not null,
  commission_amount numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create index on order_items (order_id);
create index on order_items (brand_id);

-- Monthly commission invoices per brand
create table brand_payouts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id),
  period_start date not null,
  period_end date not null,
  total_sales numeric(10,2) not null,
  total_commission numeric(10,2) not null,
  amount_due numeric(10,2) not null,
  status payout_status not null default 'draft',
  generated_at timestamptz not null default now(),
  unique (brand_id, period_start, period_end)
);

-- Discounts / promotions
create table discounts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id) on delete cascade, -- null = platform-wide
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  value numeric(10,2) not null,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

-- Row level security
alter table profiles enable row level security;
alter table brands enable row level security;
alter table brand_members enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table brand_payouts enable row level security;
alter table discounts enable row level security;

-- Profiles
create policy "profiles_self" on profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);

-- Brands
create policy "brands_public_read" on brands for select using (status = 'active');
create policy "brands_seller_manage" on brands for all using (
  exists (select 1 from brand_members where brand_id = brands.id and user_id = auth.uid())
);
create policy "brands_admin_all" on brands for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Products
create policy "products_public_read" on products for select using (
  status = 'active' and exists (select 1 from brands where id = brand_id and status = 'active')
);
create policy "products_seller_manage" on products for all using (
  exists (select 1 from brand_members where brand_id = products.brand_id and user_id = auth.uid())
);
create policy "products_admin_all" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Variants
create policy "variants_public_read" on product_variants for select using (
  exists (select 1 from products p join brands b on b.id = p.brand_id
          where p.id = product_id and p.status = 'active' and b.status = 'active')
);
create policy "variants_seller_manage" on product_variants for all using (
  exists (select 1 from products p join brand_members bm on bm.brand_id = p.brand_id
          where p.id = product_variants.product_id and bm.user_id = auth.uid())
);

-- Orders
create policy "orders_customer_own" on orders for select using (auth.uid() = customer_id);
create policy "orders_customer_create" on orders for insert with check (auth.uid() = customer_id);
create policy "orders_admin_all" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Order items
create policy "order_items_seller_read" on order_items for select using (
  exists (select 1 from brand_members where brand_id = order_items.brand_id and user_id = auth.uid())
);
create policy "order_items_customer_read" on order_items for select using (
  exists (select 1 from orders where id = order_items.order_id and customer_id = auth.uid())
);
create policy "order_items_admin_all" on order_items for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Payouts
create policy "payouts_seller_read" on brand_payouts for select using (
  exists (select 1 from brand_members where brand_id = brand_payouts.brand_id and user_id = auth.uid())
);
create policy "payouts_admin_all" on brand_payouts for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Discounts
create policy "discounts_public_read" on discounts for select using (active = true);
create policy "discounts_seller_manage" on discounts for all using (
  brand_id is not null and exists (select 1 from brand_members where brand_id = discounts.brand_id and user_id = auth.uid())
);
create policy "discounts_admin_all" on discounts for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
notepad "supabase\migrations\20260920100724_init_schema.sql"