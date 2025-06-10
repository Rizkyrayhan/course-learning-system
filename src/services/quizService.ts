
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
  const newQuizData = {
    ...data,
    questions: (data.questions || []).map(q => ({
        ...q,
        id: q.id || `q-${Date.now()}-${Math.random().toString(36).substring(2,7)}`
    })),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  };
  const docRef = await addDoc(quizzesCollection, newQuizData);
  // Constructing the return object
  return {
    id: docRef.id,
    ...data, // original data
    questions: newQuizData.questions,
    createdAt: newQuizData.createdAt.toDate().toISOString(),
    updatedAt: newQuizData.updatedAt.toDate().toISOString(),
  };
}

export async function updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  const updateData = {
      ...data,
      updatedAt: Timestamp.fromDate(new Date())
  };
  if (data.questions) {
      updateData.questions = data.questions.map(q => ({
          ...q,
          id: q.id || `q-${Date.now()}-${Math.random().toString(36).substring(2,7)}`
      }));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteQuiz(id: string): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  await deleteDoc(docRef);
}
