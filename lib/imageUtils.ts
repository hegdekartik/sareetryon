/**
 * Resizes and compresses an image Data URL on the client to optimize API payload size & speed.
 * @param dataUrl Original base64 data URL
 * @param maxDimension Maximum width or height in pixels (default 1280px)
 * @param quality Compression quality from 0.0 to 1.0 (default 0.85)
 */
export function compressImage(
  dataUrl: string,
  maxDimension = 1280,
  quality = 0.85
): Promise<{ compressedUrl: string; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({ compressedUrl, width, height });
      } else {
        resolve({ compressedUrl: dataUrl, width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    img.onerror = () => {
      resolve({ compressedUrl: dataUrl, width: 800, height: 800 });
    };
    img.src = dataUrl;
  });
}
