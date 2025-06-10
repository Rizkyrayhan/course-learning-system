
"use server";

import { db } from '@/lib/firebase';
import type { Quiz } from '@/types';
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
  where,
  Timestamp
} from 'firebase/firestore';

const quizzesCollection = collection(db, 'quizzes');

export async function getQuizzes(): Promise<Quiz[]> {
  const q = query(quizzesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const docRef = doc(db, 'quizzes', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Quiz;
  }
  return null;
}

export async function getQuizzesByCourseId(courseId: string): Promise<Quiz[]> {
  const q = query(quizzesCollection, where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
}

export async function addQuiz(data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
  const newQuiz = { 
    ...data, 
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(quizzesCollection, newQuiz);
  return { id: docRef.id, ...newQuiz };
}

export async function updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString()});
}

export async function deleteQuiz(id: string): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  await deleteDoc(docRef);
}
