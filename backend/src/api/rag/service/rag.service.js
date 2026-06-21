import fs from "fs/promises";
import { safeExecute } from "../../../../db/config.js";
import { NotFoundError } from "../../../utils/errors/index.js";

export const deleteDocumentService = async ({ documentId, userId }) => {
  // Look up the document first so we can return a clean 404 when the id
  // doesn't exist, rather than silently deleting nothing.
  const documents = await safeExecute(
    `
      SELECT document_id, user_id, storage_path
      FROM documents
      WHERE document_id = ?
      LIMIT 1
    `,
    [documentId],
  );

  if (!documents || documents.length === 0) {
    throw new NotFoundError("Document not found");
  }

  const document = documents[0];

  // A document may only be deleted by its owner. Respond with 404 (not 403)
  // for someone else's document so the endpoint doesn't reveal that an id
  // belonging to another user exists.
  if (Number(document.user_id) !== Number(userId)) {
    throw new NotFoundError("Document not found");
  }

  // Remove the PDF from disk before deleting the DB row, so a failure here
  // doesn't leave an orphaned file with no record pointing at it.
  await fs.unlink(document.storage_path);

  // Delete the record. ON DELETE CASCADE on document_chunks (and in turn
  // document_chunk_vectors) removes all chunks and embeddings automatically.
  await safeExecute(
    `
      DELETE FROM documents
      WHERE document_id = ?
      LIMIT 1
    `,
    [documentId],
  );

  return { id: documentId };
};
