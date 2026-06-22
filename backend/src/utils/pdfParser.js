import pdfParse from "pdf-parse";

export const extractTextFromPDF = async (filebuffer) => {
  const result = await pdfParse(filebuffer);
  return result.text || "";
};
