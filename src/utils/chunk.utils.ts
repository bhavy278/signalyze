/**
 * Splits a large string into smaller chunks of a given character size.
 * Note: You can also improve this later with smarter token-based chunking.
 */
export function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize;
  }
  return chunks;
}
