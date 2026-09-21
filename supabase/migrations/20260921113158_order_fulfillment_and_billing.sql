create type order_item_fulfillment_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

alter table order_items add column fulfillment_status order_item_fulfillment_status not null default 'pending';

create policy "order_items_seller_update" on order_items for update using (
  exists (select 1 from brand_members where brand_id = order_items.brand_id and user_id = auth.uid())
);