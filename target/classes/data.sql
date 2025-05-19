-- Only runs when database is created/empty
INSERT INTO users (name, email, password, role, active)
VALUES ('Admin User', 'admin@example.com', '$2a$10$4SjmZpMQYCg0YfS7jnCKy.u8s3.Zn0PfVzQ9raYiKpfEw6bPtMUn2', 'ROLE_ADMIN', true),
       ('Regular User', 'user@example.com', '$2a$10$4SjmZpMQYCg0YfS7jnCKy.u8s3.Zn0PfVzQ9raYiKpfEw6bPtMUn2', 'ROLE_USER', true);

UPDATE users
SET role = 'ROLE_ADMIN'
WHERE email = 'admin@gmail.com';