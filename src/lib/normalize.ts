/**
 * Chuẩn hóa chuỗi: bỏ dấu tiếng Việt, lowercase
 * "Nỗi Buồn" → "noi buon"
 */
export function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ combining diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
}

export function matchSearch(text: string, query: string): boolean {
  if (!query) return true
  const normalizedText = normalize(text)
  const normalizedQuery = normalize(query)
  // Hỗ trợ tìm kiếm từng từ (space-separated)
  return normalizedQuery
    .split(/\s+/)
    .every((word) => normalizedText.includes(word))
}
