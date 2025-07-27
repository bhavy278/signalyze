export const AUTH_QUERIES = {
  REGISTER_NEW_USER: "../sql/queries/auth/register_new_user_call.sql",
  FIND_USER_BY_EMAIL: "../sql/queries/auth/find_user_by_email.sql",
};

export const USER_QUERIES = {
  GET_PASSWORD_BY_EMAIL: "../sql/queries/user/get_password_by_email.sql",
  UPDATE_PASSWORD_BY_EMAIL: "../sql/queries/user/update_password_by_email.sql",
};

export const DOCUMENT_QUERIES = {
  SAVE_DOCUMENT: "../sql/queries/document/save_document.sql",
  GET_ALL_DOCUMENTS_BY_USER:
    "../sql/queries/document/get_all_documents_by_user.sql",
  GET_SINGLE_DOCUMENT_BY_DOCUMENT_ID:
    "../sql/queries/document/get_single_document_by_document_id.sql",
  DELETE_DOCUMENT_BY_ID:
    "../sql/queries/document/delete_document_by_id.sql",
};

export const STORED_PROCEDURES = {
  REGISTER_USER: "../sql/procedures/sp_register_user.sql",
  SAVE_DOCUMENT: "../sql/procedures/sp_save_new_document.sql",
};
