create policy "order_items_customer_insert" on order_items for insert with check (
  exists (select 1 from orders where id = order_items.order_id and customer_id = auth.uid())
);