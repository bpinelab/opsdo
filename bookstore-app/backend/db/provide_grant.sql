-- Grant SELECT on public.settings to supabase_auth_admin
GRANT SELECT ON TABLE public.settings TO supabase_auth_admin;

-- Grant INSERT on public.transactions to supabase_auth_admin
GRANT SELECT, INSERT, DELETE ON TABLE public.transactions TO supabase_auth_admin;

-- Grant INSERT, UPDATE on public.points to supabase_auth_admin
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.points TO supabase_auth_admin;


-- REVOKE SELECT ON TABLE public.settings FROM supabase_auth_admin;\
-- REVOKE SELECT, INSERT, DELETE ON TABLE public.transactions FROM supabase_auth_admin;
-- REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.points FROM supabase_auth_admin;

