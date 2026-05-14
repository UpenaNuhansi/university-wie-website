// src/services/contactService.js
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

const CONTACT_COLLECTION = 'contact_messages';

// Submit a new contact message
export const submitContactMessage = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
      ...payload,
      status: 'unread',        // optional: mark as unread
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
};

// Get all messages (admin use)
export const getContactMessages = async () => {
  try {
    const q = query(
      collection(db, CONTACT_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

// Update a message (e.g., mark as read)
export const updateContactMessage = async (messageId, updates) => {
  try {
    const messageRef = doc(db, CONTACT_COLLECTION, messageId);
    await updateDoc(messageRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { id: messageId, ...updates };
  } catch (error) {
    console.error('Error updating contact message:', error);
    throw error;
  }
};

// Delete a message
export const deleteContactMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, CONTACT_COLLECTION, messageId));
    return true;
  } catch (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
};

// Backward-compatible aliases used by admin screens
export const getMessages = getContactMessages;
export const updateMessage = updateContactMessage;
export const deleteMessage = deleteContactMessage;