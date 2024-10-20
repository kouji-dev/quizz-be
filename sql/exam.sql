CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    exam_name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(255)
);