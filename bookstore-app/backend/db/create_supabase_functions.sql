-- Function to add signup points
CREATE OR REPLACE FUNCTION add_signup_points()
RETURNS TRIGGER AS $$
DECLARE
  signup_points INTEGER;
BEGIN
  -- Get signup points from settings table
  SELECT value::INTEGER INTO signup_points
  FROM public.settings
  WHERE key = 'signup_points';

  -- Insert transaction with signup points
  INSERT INTO public.transactions (user_id, points_earned)
  VALUES (NEW.id, signup_points);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update points when a transaction is inserted
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct points if used
  IF NEW.points_used > 0 THEN
    UPDATE public.points
    SET points = points - NEW.points_used,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;
  END IF;

  -- Add points if earned
  IF NEW.points_earned > 0 THEN
    INSERT INTO public.points (user_id, points, updated_at)
    VALUES (NEW.user_id, NEW.points_earned, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE
    SET points = points.points + EXCLUDED.points,
      updated_at = CURRENT_TIMESTAMP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to delete user-related data
CREATE OR REPLACE FUNCTION delete_user_related_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Debugging statement
  RAISE NOTICE 'Deleting related data for user_id: %', OLD.id;

  -- Delete related data from transactions and points tables
  DELETE FROM public.transactions WHERE user_id = OLD.id;
  DELETE FROM public.points WHERE user_id = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;