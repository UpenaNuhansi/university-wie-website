import { db } from '../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const EXCOM_COLLECTION = 'executiveCommittee';

export const getExComMembers = async () => {
  try {
    const q = query(collection(db, EXCOM_COLLECTION), orderBy('year', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching ExCom members:', error);
    throw error;
  }
};

export const addExComMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, EXCOM_COLLECTION), {
      ...memberData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...memberData };
  } catch (error) {
    console.error('Error adding ExCom member:', error);
    throw error;
  }
};

export const updateExComMember = async (id, memberData) => {
  try {
    const docRef = doc(db, EXCOM_COLLECTION, id);
    await updateDoc(docRef, memberData);
    return { id, ...memberData };
  } catch (error) {
    console.error('Error updating ExCom member:', error);
    throw error;
  }
};

export const deleteExComMember = async (id) => {
  try {
    await deleteDoc(doc(db, EXCOM_COLLECTION, id));
    return id;
  } catch (error) {
    console.error('Error deleting ExCom member:', error);
    throw error;
  }
};
