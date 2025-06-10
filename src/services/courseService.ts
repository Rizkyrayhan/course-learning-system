
"use server";

import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';

const coursesCollection = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  const q = query(coursesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
}

export async function getCourseById(id: string): Promise<Course | null> {
  const docRef = doc(db, 'courses', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Course;
  }
  return null;
}

export async function addCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  const newCourse = { 
    ...data, 
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(coursesCollection, newCourse);
  return { id: docRef.id, ...newCourse };
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'courses', id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString()});
}

export async function deleteCourse(id: string): Promise<void> {
  const docRef = doc(db, 'courses', id);
  await deleteDoc(docRef);
}
