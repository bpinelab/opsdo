-- privide 100 points for a user signing up
INSERT INTO settings (key, value) VALUES ('signup_points', '100')
ON CONFLICT (key) DO NOTHING;