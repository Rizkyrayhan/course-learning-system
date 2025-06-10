
"use server";

import { db } from '@/lib/firebase';
import type { Quiz, Question } from '@/types';
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

const mapQuizDocument = (docSnap: any): Quiz => {
  const data = docSnap.data();
  const questions = (data.questions || []).map((q: any): Question => ({
    id: q.id || `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    text: q.text || '',
    options: Array.isArray(q.options) ? q.options : [],
    correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
    type: q.type || 'multiple-choice',
  }));
  return {
    id: docSnap.id,
    title: data.title || '',
    description: data.description || '',
    courseId: data.courseId,
    questions: questions,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt && (data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt),
  } as Quiz;
};

export async function getQuizzes(): Promise<Quiz[]> {
  const q = query(quizzesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapQuizDocument);
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const docRef = doc(db, 'quizzes', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return mapQuizDocument(docSnap);
  }
  return null;
}

export async function getQuizzesByCourseId(courseId: string): Promise<Quiz[]> {
  const q = query(quizzesCollection, where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapQuizDocument);
}

export async function addQuiz(data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
  const newQuiz = { 
    ...data, 
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(quizzesCollection, newQuiz);
  // Fetch the newly created document to ensure consistent data structure (including converted timestamps if applicable)
  const newDocSnap = await getDoc(docRef);
  return mapQuizDocument(newDocSnap);
}

export async function updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString()});
}

export async function deleteQuiz(id: string): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  await deleteDoc(docRef);
}
