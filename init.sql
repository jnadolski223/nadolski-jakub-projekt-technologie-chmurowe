CREATE TABLE IF NOT EXISTS accounts (
    userId UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO accounts (userId, username, email, password) VALUES
  ('7e1a0f53-8ae1-4b77-95b3-30920d878730', 'alice',   'alice@example.com',   'password123'),
  ('f6b74b0b-5e25-4703-ae3a-35671e43b1d2', 'bob',     'bob@example.com',     'password123'),
  ('0a4fa6c4-b7d1-4da5-bf57-172a0a58e601', 'carol',   'carol@example.com',   'password123'),
  ('c8072902-1e5c-4b0e-9985-97ee33ba4039', 'dave',    'dave@example.com',    'password123'),
  ('20a86123-0b41-4cd1-81ae-72a32e878a3c', 'erin',    'erin@example.com',    'password123'),
  ('5e92b3e4-6f83-4273-aea1-77b1a6b57a93', 'frank',   'frank@example.com',   'password123'),
  ('a679b021-316b-4a63-90b8-84834f7e8de3', 'grace',   'grace@example.com',   'password123'),
  ('3f3b06bb-e3f5-4427-9ef5-98e7e07c8024', 'heidi',   'heidi@example.com',   'password123'),
  ('d7a2c2cb-295c-4215-8b83-1ef59d7a3472', 'ivan',    'ivan@example.com',    'password123'),
  ('b49f3d5f-1af6-4fb4-9890-3c65c16e8930', 'judy',    'judy@example.com',    'password123');
