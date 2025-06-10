
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
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt && (data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt),
    } as Announcement;
  });
}

export async function addAnnouncement(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
  const newAnnouncementData = {
    ...data,
    createdAt: Timestamp.fromDate(new Date()), // Store as Firestore Timestamp
    updatedAt: Timestamp.fromDate(new Date()),
  };
  const docRef = await addDoc(announcementsCollection, newAnnouncementData);
  // For consistency with the type, we immediately read it back or simulate the expected output structure.
  // However, to avoid an extra read, we'll construct it based on what we sent and the ID.
  return {
    id: docRef.id,
    title: data.title,
    content: data.content,
    createdAt: newAnnouncementData.createdAt.toDate().toISOString(),
    updatedAt: newAnnouncementData.updatedAt.toDate().toISOString(),
  };
}

export async function updateAnnouncement(id: string, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'announcements', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.fromDate(new Date()) // Store as Firestore Timestamp
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const docRef = doc(db, 'announcements', id);
  await deleteDoc(docRef);
}
