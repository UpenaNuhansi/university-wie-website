import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const EVENTS_COLLECTION = 'events';

export const getEvents = async () => {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const addEvent = async (event) => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...event,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, updates) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { id: eventId, ...updates };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
