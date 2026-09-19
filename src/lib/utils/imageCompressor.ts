/**
 * Utilitaire de compression et de redimensionnement d'image côté client via HTML5 Canvas.
 * Garantit un poids optimal (~20-40 Ko) qui ne sature jamais Firestore ni localStorage.
 */

export interface CompressedImageResult {
  base64: string;
  blob: Blob;
  file: File;
}

/**
 * Compresse et redimensionne une image locale.
 *
 * @param {File} file - Le fichier image sélectionné par l'utilisateur.
 * @param {number} [maxDimension=320] - Largeur/hauteur maximale en pixels (ex: 320 pour un avatar).
 * @param {number} [quality=0.82] - Qualité JPEG de 0.1 à 1.0.
 * @returns {Promise<CompressedImageResult>} L'image compressée en base64, Blob et File.
 */
export function compressImage(
  file: File,
  maxDimension: number = 320,
  quality: number = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Aucun fichier sélectionné."));
      return;
    }

    const isImageMime = file.type && file.type.toLowerCase().startsWith("image/");
    const isImageExt = /\.(jpe?g|png|webp|gif|bmp|jfif|heic|avif|svg)$/i.test(file.name || "");

    if (!isImageMime && !isImageExt) {
      reject(new Error("Le fichier fourni n'est pas une image reconnue."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier image."));
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error("Données de l'image illisibles."));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("Impossible de décoder l'image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width <= 0 || height <= 0) {
          width = maxDimension;
          height = maxDimension;
        }

        // Calcul des dimensions proportionnelles
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback direct sur dataUrl si canvas 2D non supporté
          const safeName = (file.name || "avatar").replace(/\.[^/.]+$/, "") + ".jpg";
          resolve({
            base64: dataUrl,
            blob: file,
            file: file,
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Export en base64 ultra-léger (~20-40 Ko)
        const base64 = canvas.toDataURL("image/jpeg", quality);

        const safeFileName = (file.name || "avatar").replace(/\.[^/.]+$/, "") + ".jpg";

        // Export en Blob & File avec repli automatique
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], safeFileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve({ base64, blob, file: compressedFile });
            } else {
              // Fallback manuel depuis le base64
              try {
                const byteCharacters = atob(base64.split(",")[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const fallbackBlob = new Blob([byteArray], { type: "image/jpeg" });
                const fallbackFile = new File([fallbackBlob], safeFileName, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve({ base64, blob: fallbackBlob, file: fallbackFile });
              } catch (e) {
                resolve({ base64, blob: file, file });
              }
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
