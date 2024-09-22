-- Trigger to add signup points when a new user is inserted
CREATE TRIGGER add_signup_points_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.add_signup_points();

-- Trigger to update points when a transaction is inserted
CREATE TRIGGER update_points_trigger
AFTER INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_user_points();

-- Trigger to delete user-related data when a user is deleted
CREATE TRIGGER delete_user_related_data_trigger
AFTER DELETE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.delete_user_related_data();

-- DROP TRIGGER IF EXISTS update_points_trigger ON public.transactions;
-- DROP TRIGGER IF EXISTS add_signup_points_trigger ON auth.users;
-- DROP TRIGGER IF EXISTS delete_user_related_data_trigger ON auth.users;