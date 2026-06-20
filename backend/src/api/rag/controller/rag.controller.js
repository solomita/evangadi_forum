import { StatusCodes } from 'http-status-codes';
import { getDocumentMetaService } from '../service/rag.service.js';

export const getDocumentMetaController = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
    const document = await getDocumentMetaService(documentId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Document fetched successfully.',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};