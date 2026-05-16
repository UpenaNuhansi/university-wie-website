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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

const EVENTS_COLLECTION = "events";

const normalizeEventImages = (data) => {
  if (Array.isArray(data.images)) {
    return data.images.filter(Boolean);
  }

  if (data.images) {
    return [data.images].filter(Boolean);
  }

  if (data.image) {
    return [data.image].filter(Boolean);
  }

  return [];
};

const convertEventData = (data) => {
  const converted = { ...data };

  if (data.date?.toDate) converted.date = data.date.toDate();
  if (data.createdAt?.toDate) converted.createdAt = data.createdAt.toDate();
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

  converted.images = normalizeEventImages(data);
  if (!converted.image && converted.images.length) {
    converted.image = converted.images[0];
  }
  if (!converted.images.length && converted.image) {
    converted.images = [converted.image];
  }

  return converted;
};

export const getEvents = async () => {
  const snap = await getDocs(collection(db, EVENTS_COLLECTION));
  const items = snap.docs.map((d) => ({ id: d.id, ...convertEventData(d.data()) }));

  // Sort client-side: prefer events with a date (newest first), then fall back to createdAt
  items.sort((a, b) => {
    const aDate = a.date instanceof Date ? a.date.getTime() : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
    const bDate = b.date instanceof Date ? b.date.getTime() : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
    return bDate - aDate;
  });

  return items;
};

export const subscribeToEvents = (onChange, onError) => {
  const col = collection(db, EVENTS_COLLECTION);
  const unsub = onSnapshot(
    col,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...convertEventData(d.data()) }));
      items.sort((a, b) => {
        const aDate = a.date instanceof Date ? a.date.getTime() : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const bDate = b.date instanceof Date ? b.date.getTime() : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return bDate - aDate;
      });
      onChange(items);
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  return unsub;
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
  const images = normalizeEventImages(event);
  return await addDoc(collection(db, EVENTS_COLLECTION), {
    ...event,
    image: event.image || images[0] || "",
    images,
    createdAt: Timestamp.now(),
  });
};

export const updateEvent = async (id, data) => {
  const images = normalizeEventImages(data);
  await updateDoc(doc(db, EVENTS_COLLECTION, id), {
    ...data,
    image: data.image || images[0] || "",
    images,
    updatedAt: Timestamp.now(),
  });
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, EVENTS_COLLECTION, id));
};