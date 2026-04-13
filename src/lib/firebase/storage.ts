// src/lib/firebase/storage.ts
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  FirebaseStorage,
  UploadResult 
} from 'firebase/storage';
import { auth } from './firebaseconfig';

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
    throw new Error(
      `Image trop lourde : ${Math.round(file.size / 1024 / 1024)}MB (max 5MB)`
    );
  }

  // 🎨 Vérification format : EXTENSION + MIME TYPE (double vérification)
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  // Extensions autorisées
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const hasValidExtension = allowedExtensions.some(ext => 
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
      size: `${Math.round(file.size / 1024)} KB`
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
    return downloadURL;
    
  } catch (error: any) {
    console.error('❌ Erreur Firebase Storage:', error);
    
    // Messages d'erreur plus explicites
    if (error.code === 'storage/unauthorized') {
      throw new Error('Permissions insuffisantes : vérifiez les règles Firebase Storage');
    }
    if (error.code === 'storage/canceled') {
      throw new Error('Upload annulé');
    }
    if (error.code === 'storage/unknown') {
      throw new Error('Erreur réseau : vérifiez votre connexion');
    }
    
    throw error;
  }
};

/**
 * Supprimer un avatar (utile si l'utilisateur change de photo)
 */
export const deleteAvatar = async (userId: string, photoURL: string): Promise<void> => {
  if (!photoURL) return;
  
  try {
    const { getStorage, ref, deleteObject } = await import('firebase/storage');
    const storage = getStorage();
    
    // Extraire le chemin depuis l'URL (optionnel, si tu stockes le path ailleurs c'est mieux)
    const urlParts = photoURL.split('/o/');
    if (urlParts.length < 2) return;
    
    const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
    const fileRef = ref(storage, filePath);
    
    await deleteObject(fileRef);
    console.log('🗑️ Ancien avatar supprimé');
  } catch (error) {
    console.warn('⚠️ Impossible de supprimer l\'ancien avatar:', error);
    // Ne pas bloquer l'upload si la suppression échoue
  }
};