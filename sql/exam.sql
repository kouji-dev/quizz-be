CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(255)
);

INSERT INTO exams (name, description, avatar_url) VALUES
('France', 'Testez vos connaissances sur l’histoire, la culture et les valeurs de la France pour devenir un citoyen français fier et informé.', ''),
('Italia', 'Scopri l’Italia attraverso la sua storia, la sua cultura e le sue tradizioni, e fai un passo avanti verso la cittadinanza italiana.', ''),
('España', 'Demuestra tu compromiso con España realizando este examen sobre la cultura, la historia y los valores españoles.', ''),
('United States', 'Embark on a journey through the history and values of the United States to fulfill your dream of American citizenship.', ''),
('Deutschland', 'Bereiten Sie sich darauf vor, Teil der deutschen Gemeinschaft zu werden, indem Sie die Kultur und die Werte Deutschlands kennenlernen.', ''),
('United Kingdom', 'Deepen your knowledge of British culture, history, and values to become a citizen of the United Kingdom.', '');
