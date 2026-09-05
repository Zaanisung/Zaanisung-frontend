export function compressImage(
  file: File,
  maxDimension = 1000,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(
          1,
          maxDimension / Math.max(img.width, img.height)
        );
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        if (dataUrl.length >= file.size && file.type === "image/jpeg") {
          URL.revokeObjectURL(objectUrl);
          const rawReader = new FileReader();
          rawReader.onload = () => {
            if (typeof rawReader.result === "string") {
              resolve(rawReader.result);
            } else {
              reject(new Error("Could not read image."));
            }
          };
          rawReader.onerror = () =>
            reject(rawReader.error || new Error("Could not read image."));
          rawReader.readAsDataURL(file);
          return;
        }

        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image."));
    };
    img.src = objectUrl;
  });
}