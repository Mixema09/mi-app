-- Endurece las funciones creadas en 0001:
-- - fija search_path en set_updated_at
-- - revoca EXECUTE público sobre la función trigger handle_new_user
alter function public.set_updated_at() set search_path = '';

revoke execute on function public.handle_new_user() from anon, authenticated, public;
