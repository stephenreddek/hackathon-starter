INSERT INTO user (email, password_hash)
VALUES (:email, :password_hash)
RETURNING *