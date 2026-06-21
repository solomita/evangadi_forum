import { deleteDocumentService } from "../service/rag.service.js";

export const deleteDocumentController = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const data = await deleteDocumentService({ documentId, userId });

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};
