import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const MESSAGES_COLLECTION = 'messages';

export const submitContactMessage = async (message) => {
  try {
    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      ...message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...message };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
};

export const getMessages = async () => {
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const updateMessage = async (messageId, updates) => {
  try {
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
    await updateDoc(messageRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { id: messageId, ...updates };
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId));
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
