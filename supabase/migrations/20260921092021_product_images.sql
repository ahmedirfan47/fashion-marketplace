-- storage bucket for product photos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- product_images table
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  storage_path text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index on product_images (product_id);

alter table product_images enable row level security;

create policy "product_images_public_read" on product_images for select using (
  exists (
    select 1 from products p join brands b on b.id = p.brand_id
    where p.id = product_id and p.status = 'active' and b.status = 'active'
  )
);

create policy "product_images_seller_manage" on product_images for all using (
  exists (
    select 1 from products p join brand_members bm on bm.brand_id = p.brand_id
    where p.id = product_images.product_id and bm.user_id = auth.uid()
  )
);

-- storage policies (path convention: products/<product_id>/<filename>)
create policy "product images public read" on storage.objects for select using (
  bucket_id = 'product-images'
);

create policy "product images seller insert" on storage.objects for insert with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from products p join brand_members bm on bm.brand_id = p.brand_id
    where p.id::text = (storage.foldername(name))[2] and bm.user_id = auth.uid()
  )
);

create policy "product images seller delete" on storage.objects for delete using (
  bucket_id = 'product-images'
  and exists (
    select 1 from products p join brand_members bm on bm.brand_id = p.brand_id
    where p.id::text = (storage.foldername(name))[2] and bm.user_id = auth.uid()
  )
);