
DROP PROCEDURE IF EXISTS SaveAnalysis;


CREATE PROCEDURE SaveAnalysis (
    IN p_document_id INT,
    IN p_analysis_json JSON
)
BEGIN
    DECLARE next_version INT;

    SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
    FROM signalyze.analysis
    WHERE document_id = p_document_id;

    INSERT INTO signalyze.analysis (document_id, version, analysis_json)
    VALUES (p_document_id, next_version, p_analysis_json);

    UPDATE signalyze.documents
    SET latest_version = next_version
    WHERE id = p_document_id;

    SELECT * FROM signalyze.analysis WHERE id = LAST_INSERT_ID();
END;

