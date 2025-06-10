
"use server";

import { db } from '@/lib/firebase';
import type { Announcement } from '@/types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';

const announcementsCollection = collection(db, 'announcements');

export async function getAnnouncements(): Promise<Announcement[]> {
  const q = query(announcementsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
}

export async function addAnnouncement(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
  const newAnnouncement = { 
    ...data, 
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(announcementsCollection, newAnnouncement);
  return { id: docRef.id, ...newAnnouncement };
}

export async function updateAnnouncement(id: string, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'announcements', id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString()});
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const docRef = doc(db, 'announcements', id);
  await deleteDoc(docRef);
}
