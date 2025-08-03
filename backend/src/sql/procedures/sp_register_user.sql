DROP PROCEDURE IF EXISTS RegisterUser;

CREATE PROCEDURE RegisterUser (
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_role ENUM('user', 'admin')
)
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists';
    ELSE
        INSERT INTO users (name, email, password, role, created_at)
        VALUES (p_name, p_email, p_password, p_role, NOW());
    END IF;
END;