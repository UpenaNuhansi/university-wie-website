import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { localEventsData } from "../pages/Events";


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
  const items = [...localEventsData];
  items.sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    return bDate - aDate;
  });
  return items;
};

export const subscribeToEvents = (onChange, onError) => {
  const items = [...localEventsData];
  items.sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    return bDate - aDate;
  });
  onChange(items);
  return () => {};
};

export const getEventById = async (id) => {
  const event = localEventsData.find((e) => e.id === id);
  if (!event) throw new Error("Event not found");
  return event;
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