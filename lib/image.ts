export type CropAreaPixels = { x: number; y: number; width: number; height: number };

export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Crops an image (dataURL) using crop pixels and then resizes to maxWidth (keeps aspect).
 * Returns a JPEG Blob + suggested filename.
 */
export async function cropAndResizeToJpeg(params: {
  dataUrl: string;
  crop: CropAreaPixels;
  maxWidth: number;      // e.g. 1600
  quality: number;       // 0..1 e.g. 0.86
  filenameBase: string;  // e.g. "women-enterprise"
}): Promise<{ blob: Blob; filename: string }> {
  const { dataUrl, crop, maxWidth, quality, filenameBase } = params;
  const img = await loadImage(dataUrl);

  // Source crop (in natural pixel coords)
  const sx = clamp(Math.round(crop.x), 0, img.naturalWidth - 1);
  const sy = clamp(Math.round(crop.y), 0, img.naturalHeight - 1);
  const sw = clamp(Math.round(crop.width), 1, img.naturalWidth - sx);
  const sh = clamp(Math.round(crop.height), 1, img.naturalHeight - sy);

  // Resize
  const outW = Math.min(maxWidth, sw);
  const outH = Math.round((outW / sw) * sh);

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create image blob"))),
      "image/jpeg",
      clamp(quality, 0.4, 0.95)
    );
  });

  const filename = `${filenameBase}-${Date.now()}.jpg`;
  return { blob, filename };
}

export function safeSlug(s: string) {
  return (s || "image")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
}