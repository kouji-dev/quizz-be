CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    exam_id INTEGER,
    FOREIGN KEY (exam_id) REFERENCES exams(id)
);
