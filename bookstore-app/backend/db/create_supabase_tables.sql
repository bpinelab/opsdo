-- Create the writers table
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    age INT,
    background TEXT
);

-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES writers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    publication_date DATE,
    blurb VARCHAR(40),
    content TEXT NOT NULL
);
