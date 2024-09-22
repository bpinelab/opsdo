-- privide 100 points for a user signing up
INSERT INTO settings (key, value) VALUES ('signup_points', '100')
ON CONFLICT (key) DO NOTHING;

-- set the default year and company name
INSERT INTO settings (key, value) VALUES ('year', '2024');
INSERT INTO settings (key, value) VALUES ('companyName', 'opsdo');