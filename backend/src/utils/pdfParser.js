
import { PDFParse } from 'pdf-parse';

export const extractTextFromPDF = async (filebuffer)=>{
  const parser =new PDFParse({data:filebuffer});
  const result = await parser.getText();
  return result.text
}
