
DROP PROCEDURE IF EXISTS SaveDocument;
CREATE PROCEDURE SaveDocument (
  IN p_user_id INT,
  IN p_filename VARCHAR(255),
  IN p_original_filename VARCHAR(255),
  IN p_filepath VARCHAR(512),
  IN p_size INT,
  IN p_type VARCHAR(255),
  IN p_uploaded_at DATETIME,
  IN p_deleted BOOLEAN
)
BEGIN
  INSERT INTO
  signalyze.documents (
    user_id,
    filename,
    original_filename,
    filepath,
    size,
    type,
    uploaded_at,
    deleted
  )
  VALUES
    (
      p_user_id,
      p_filename,
      p_original_filename,
      p_filepath,
      p_size,
      p_type,
      p_uploaded_at,
      p_deleted
    );
    SELECT * FROM signalyze.documents WHERE id = LAST_INSERT_ID();
    END;
