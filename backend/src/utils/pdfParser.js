import * as pdfParseModule from "pdf-parse";

export const extractTextFromPDF = async (fileBuffer) => {
  if (typeof pdfParseModule.default === "function") {
    const result = await pdfParseModule.default(fileBuffer);
    return result.text;
  }

  const parser = new pdfParseModule.PDFParse({ data: fileBuffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};
