// services/galleryService.js

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const GALLERY_COLLECTION = 'gallery';

/**
 * Compress & resize an image File into a Base64 JPEG string.
 * Max width 800 px, quality 0.75 → document stays well under Firestore's 1 MB limit.
 *
 * @param {File} file
 * @param {(pct: number) => void} [onProgress]  called with 0-100
 * @returns {Promise<string>} base64 data-URL  (e.g. "data:image/jpeg;base64,…")
 */
export const compressImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (onProgress) onProgress(10);

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      if (onProgress) onProgress(30);

      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX_W = 800;
        const scale = img.width > MAX_W ? MAX_W / img.width : 1;

        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        if (onProgress) onProgress(70);

        let base64 = canvas.toDataURL('image/jpeg', 0.75);

        // If still too large, retry at lower quality
        const estimatedKB = Math.round((base64.length * 3) / 4 / 1024);
        if (estimatedKB > 900) {
          base64 = canvas.toDataURL('image/jpeg', 0.5);
        }

        if (onProgress) onProgress(95);
        resolve(base64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Fetch all gallery items, newest first.
 */
export const getGalleryItems = async () => {
  try {
    const q = query(
      collection(db, GALLERY_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

/**
 * Add a new gallery item.
 * @param {{ title: string, image: string, category: string }} item
 *   `image` should be the base64 data-URL returned by compressImage()
 */
export const addGalleryItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      title:     item.title,
      image:     item.image,
      category:  item.category,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

/**
 * Delete a gallery item from Firestore.
 */
export const deleteGalleryItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, itemId));
    return true;
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};