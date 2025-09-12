/**
 * Strips HTML tags from a string and normalizes whitespace
 * @param htmlString - The HTML string to clean
 * @returns Clean text without HTML tags
 */
export function stripHtml(htmlString: string): string {
  return htmlString
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, ' ')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Cleans and truncates HTML content for display
 * @param htmlString - The HTML string to clean and truncate
 * @param maxLength - Maximum length before truncation
 * @returns Clean, truncated text
 */
export function cleanAndTruncateHtml(htmlString: string, maxLength: number = 150): string {
  return truncateText(stripHtml(htmlString), maxLength);
}
