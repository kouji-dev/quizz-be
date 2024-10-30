CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id),
  name TEXT NOT NULL,
  description TEXT,
  styles JSON
);


INSERT INTO categories (exam_id, name, description, styles)
VALUES
    (4, 'Histoire de France', 'Les grands événements et figures historiques de la France, comme la Révolution française et Napoléon, qui ont façonné le pays.', '{"color": "blue", "icon": "historique"}'),
    (4, 'Géographie et Symboles', 'Les régions, départements et symboles nationaux (drapeau, Marseillaise) qui représentent l''identité française.', '{"color": "green", "icon": "map"}'),
    (4, 'Valeurs de la République', 'Les principes fondamentaux comme la liberté, l''égalité, la fraternité, et la laïcité, qui forment le socle de la société française.', '{"color": "purple", "icon": "valeurs"}'),
    (4, 'Institutions', 'Les structures et fonctions de l''État, notamment le rôle du Président, du Parlement, et du système judiciaire.', '{"color": "red", "icon": "institutions"}'),
    (4, 'Culture Française', 'Les arts, traditions et grandes figures culturelles (littérature, cinéma, musique) qui définissent la richesse culturelle de la France.', '{"color": "orange", "icon": "culture"}'),
    (4, 'Vie en France', 'Les fêtes nationales, les modes de vie, et les aspects sociaux comme la sécurité sociale et l''éducation.', '{"color": "yellow", "icon": "vie"}'),
    (4, 'Laïcité et Religions', 'Le principe de laïcité et la liberté des cultes, garantissant la séparation de la religion et de l''État en France.', '{"color": "gray", "icon": "religion"}');