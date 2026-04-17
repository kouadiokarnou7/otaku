import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { toast } from "sonner";

const storage: FirebaseStorage = getStorage();

/**
 * Upload d'un avatar vers Firebase Storage avec validation robuste
 */
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  // 🔐 Sécurité : vérifier les paramètres
  if (!userId || userId.trim() === '') {
    throw new Error('userId invalide');
  }
  if (!file || !(file instanceof File)) {
    throw new Error('Fichier invalide : un objet File est requis');
  }

  // 📏 Vérification taille (5MB max)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    toast.error("Fichier trop volumineux", {
      description: `L'image fait ${Math.round(file.size / 1024 / 1024)}MB, le maximum est 5MB.`,
    });
    throw new Error(
      `Image trop lourde : ${Math.round(file.size / 1024 / 1024)}MB (max 5MB)`
    );
  } else {
    // si succès on affiche une notification de succès
    toast.success("Image prête à être uploadée", {
      description: `L'image fait ${Math.round(file.size / 1024 / 1024)}MB, elle est prête à être uploadée.`,
    });
  }

  // 🎨 Vérification format : EXTENSION + MIME TYPE (double vérification)
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // Extensions autorisées
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  // MIME types autorisés
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const hasValidMimeType = allowedMimeTypes.includes(fileType);

  // ✅ Accepter si AU MOINS UN des deux est valide (plus tolérant)
  if (!hasValidExtension && !hasValidMimeType) {
    console.warn('⚠️ Format rejeté:', {
      fileName,
      fileType: fileType || '(vide)',
      hasValidExtension,
      hasValidMimeType,
      size: `${Math.round(file.size / 1024)} KB`,
    });
    toast.error("Format non supporté", {
      description: `Le format "${file.type || 'inconnu'}" n'est pas supporté. Utilisez JPEG, PNG ou WebP uniquement.`,
    });
    throw new Error(
      `Format non supporté : "${file.type || 'inconnu'}" (JPEG, PNG, WebP uniquement)`
    );
  }

  // 🧹 Nettoyage du nom de fichier (sécurité + compatibilité)
  const fileExtension = fileName.split('.').pop() || 'jpg';
  const safeFileName = `${Date.now()}_${userId}.${fileExtension}`;

  // 📦 Référence Firebase Storage
  const storageRef = ref(storage, `avatars/${userId}/${safeFileName}`);

  try {
    // 🚀 Upload avec métadonnées
    const metadata = {
      contentType: fileType || `image/${fileExtension}`,
      customMetadata: {
        uploadedBy: userId,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    };

    await uploadBytes(storageRef, file, metadata);

    // 🔗 Récupérer l'URL publique
    const downloadURL = await getDownloadURL(storageRef);

    console.log('✅ Avatar uploadé:', downloadURL);
    toast.success("Avatar uploadé avec succès !", {
      description: "Votre photo de profil a été mise à jour.",
    });
    return downloadURL;
  } catch (error) {
    console.error('❌ Erreur Firebase Storage:', error);

    // Messages d'erreur plus explicites
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: string }).code;

      if (errorCode === 'storage/unauthorized') {
        toast.error("Permissions insuffisantes", {
          description: "Vérifiez les règles Firebase Storage.",
        });
        throw new Error(
          'Permissions insuffisantes : vérifiez les règles Firebase Storage'
        );
      }
      if (errorCode === 'storage/canceled') {
        toast.error("Upload annulé", {
          description: "L'upload a été annulé.",
        });
        throw new Error('Upload annulé');
      }
      if (errorCode === 'storage/unknown') {
        toast.error("Erreur réseau", {
          description: "Vérifiez votre connexion Internet.",
        });
        throw new Error('Erreur réseau : vérifiez votre connexion');
      }
    }

    toast.error("Erreur lors de l'upload", {
      description: "Une erreur s'est produite lors de l'upload de l'image.",
    });
    throw error;
  }
};

/**
 * Supprimer un avatar (utile si l'utilisateur change de photo)
 */
export const deleteAvatar = async (
  userId: string,
  photoURL: string
): Promise<void> => {
  if (!photoURL) return;

  try {
    // Extraire le chemin depuis l'URL
    const urlParts = photoURL.split('/o/');
    if (urlParts.length < 2) return;

    const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);
    console.log('🗑️ Ancien avatar supprimé');
  } catch (error) {
    console.warn("⚠️ Impossible de supprimer l'ancien avatar:", error);
    // Ne pas bloquer l'upload si la suppression échoue
  }
};