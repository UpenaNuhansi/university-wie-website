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

export const getGalleryItems = async () => {
  try {
    const q = query(
      collection(db, GALLERY_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

export const addGalleryItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      ...item,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

export const deleteGalleryItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, itemId));
    return true;
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};
