create policy "brand_members_self_read" on brand_members for select using (user_id = auth.uid());

create policy "brand_members_admin_all" on brand_members for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);