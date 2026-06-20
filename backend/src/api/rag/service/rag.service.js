import { safeExecute } from "../../../../db/config.js";
import { NotFoundError } from "../../../utils/errors/index.js";

export const getDocumentMetaService = async (documentId, userId) => {
  const sql = `
    SELECT
      document_id,
      title,
      mime_type,
      byte_size,
      status,
      error_message,
      created_at,
      updated_at,
       user_id,
         storage_path
    FROM documents
    WHERE document_id = ? AND user_id = ?
  `;

  const rows = await safeExecute(sql, [documentId, userId]);

  if (!rows || rows.length === 0) {
    throw new NotFoundError(`Document with id ${documentId} not found.`);
  }

  return rows[0];
};
