-- get_single_document_by_document_id.sql

SELECT * FROM signalyze.documents 
WHERE documents.id = ? AND documents.user_id = ?