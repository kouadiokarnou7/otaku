import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '@/lib/firebase/firebaseconfig';

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

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error(
      `Image trop lourde : ${Math.round(file.size / 1024 / 1024)} Mo (max 5 Mo)`
    );
  }

  // 🎨 Vérification format : EXTENSION + MIME TYPE (double vérification)
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // Extensions autorisées
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.jfif', '.svg', '.gif', '.heic'];
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  // MIME types autorisés
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jfif',
    'image/gif',
    'image/svg+xml',
    'image/heic',
  ];
  const hasValidMimeType = allowedMimeTypes.includes(fileType) || fileType.startsWith('image/');

  // ✅ Accepter si AU MOINS UN des deux est valide (plus tolérant)
  if (!hasValidExtension && !hasValidMimeType) {
    console.warn('⚠️ Format non reconnu pour Storage:', {
      fileName,
      fileType: fileType || '(vide)',
      hasValidExtension,
      hasValidMimeType,
      size: `${Math.round(file.size / 1024)} KB`,
    });
    throw new Error(
      `Format d'image non supporté : "${file.type || fileName}"`
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

    // Timeout de 4 secondes pour ne jamais bloquer l'utilisateur si Storage distant est lent/indisponible
    const uploadTask = async () => {
      await uploadBytes(storageRef, file, metadata);
      return await getDownloadURL(storageRef);
    };

    const timeoutTask = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout: Firebase Storage n'a pas répondu")), 4000)
    );

    const downloadURL = await Promise.race([uploadTask(), timeoutTask]);

    console.log('✅ Avatar uploadé sur Firebase Storage:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.warn("⚠️ Upload Storage échoué ou expiré, repli automatique :", error);
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