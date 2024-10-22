CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,                     -- Identifiant unique pour chaque catégorie
    exam_id INTEGER REFERENCES exams(id),      -- Clé étrangère qui fait référence à l'ID dans la table exams
    category_name VARCHAR(255) NOT NULL,       -- Nom de la catégorie (obligatoire)
    description TEXT,                          -- Description de la catégorie
    avatar_url VARCHAR(255),                   -- URL de l'avatar associé à la catégorie
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date de création par défaut à la date et l'heure actuelles
);