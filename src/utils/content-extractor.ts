/**
 * Extract content from element
 * @param element Penpot element
 * @returns Object with content and imageUrl properties
 */
export function extractContent(element: any): { content?: string; imageUrl?: string } {
  const result: { content?: string; imageUrl?: string } = {};

  try {
    // Text content
    if (element?.type === 'text' && element?.characters && typeof element.characters === 'string') {
      result.content = element.characters;
    }

    // Image URL (for image elements)
    if (element?.type === 'image' && element?.imageData) {
      // In a real implementation, you might want to export the image
      const imageName = (element?.name && typeof element.name === 'string') ? element.name : 'image';
      result.imageUrl = `assets/${imageName}.png`;
    }
  } catch (error) {
    console.warn("Error extracting content:", error);
  }

  return result;
}