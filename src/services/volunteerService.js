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

const VOLUNTEERS_COLLECTION = 'volunteers';

export const submitVolunteerForm = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, VOLUNTEERS_COLLECTION), {
      ...payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    throw error;
  }
};

export const getVolunteers = async () => {
  try {
    const q = query(
      collection(db, VOLUNTEERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};

export const updateVolunteer = async (volunteerId, updates) => {
  try {
    const volunteerRef = doc(db, VOLUNTEERS_COLLECTION, volunteerId);
    await updateDoc(volunteerRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { id: volunteerId, ...updates };
  } catch (error) {
    console.error('Error updating volunteer:', error);
    throw error;
  }
};

export const deleteVolunteer = async (volunteerId) => {
  try {
    await deleteDoc(doc(db, VOLUNTEERS_COLLECTION, volunteerId));
    return true;
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    throw error;
  }
};
