CREATE EXTENSION vector;
CREATE TABLE if not exists markdown_chunks (
    id SERIAL PRIMARY KEY,
    heading TEXT,
    content TEXT,
    start_pos INT,
    end_pos INT,
    embedding vector(1536),
    uid varchar(256));
CREATE index uid on markdown_chunks(uid);