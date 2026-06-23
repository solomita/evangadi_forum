export const chunkText = (text, size = 1000, overlap = 150) => {
  if (typeof text !== "string" || text.length === 0) return [];

  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("chunkText: size must be a positive integer");
  }
  if (!Number.isInteger(overlap) || overlap < 0 || overlap >= size) {
    throw new Error(
      "chunkText: overlap must be an integer between 0 and size-1",
    );
  }
  const chunks = [];

  let start = 0;
  while (start < text.length) {
    const end = start + size;
    chunks.push(text.slice(start, end));

    start += size - overlap;
  }

  return chunks;
};
