CREATE OR REPLACE VIEW signalyze.document_analysis_view AS
SELECT
    d.id AS document_id,
    d.user_id,
    d.original_filename,
    d.filepath,
    d.size,
    d.type,
    d.uploaded_at,
    a.version,
    a.analysis_json,
    a.created_at AS analysis_created_at
FROM
    signalyze.documents d
JOIN
    signalyze.analysis a ON d.id = a.document_id
WHERE
    a.version = (
        SELECT MAX(version)
        FROM signalyze.analysis
        WHERE document_id = d.id
    );