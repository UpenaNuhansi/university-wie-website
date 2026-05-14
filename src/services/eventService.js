import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const EVENTS_COLLECTION = "events";

const convertEventData = (data) => {
  const converted = { ...data };

  if (data.date?.toDate) converted.date = data.date.toDate();
  if (converted.registrationEnabled === undefined) {
    converted.registrationEnabled = Boolean(data.allowRegister || data.registrationLink || data.registerLink);
  }
  if (!converted.registrationLink && data.registerLink) {
    converted.registrationLink = data.registerLink;
  }
  if (!converted.registrationType) {
    converted.registrationType = converted.registrationLink?.includes("docs.google.com") ? "google" : "custom";
  }
  if (!converted.registrationLabel) {
    converted.registrationLabel = converted.registrationType === "google" ? "Open Google Form" : "Register Now";
  }
  return converted;
};

export const getEvents = async () => {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy("date", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...convertEventData(d.data()),
  }));
};

export const getEventById = async (id) => {
  const refDoc = doc(db, EVENTS_COLLECTION, id);
  const snap = await getDoc(refDoc);

  if (!snap.exists()) throw new Error("Event not found");

  return {
    id: snap.id,
    ...convertEventData(snap.data()),
  };
};

export const addEvent = async (event) => {
  return await addDoc(collection(db, EVENTS_COLLECTION), {
    ...event,
    createdAt: Timestamp.now(),
  });
};

export const updateEvent = async (id, data) => {
  await updateDoc(doc(db, EVENTS_COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, EVENTS_COLLECTION, id));
};