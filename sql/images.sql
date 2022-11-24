DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INT REFERENCES images(id),
    commenter VARCHAR(255),
    comment VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


