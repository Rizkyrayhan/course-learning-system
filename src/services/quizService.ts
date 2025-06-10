
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
  const now = Timestamp.fromDate(new Date());
  const generatedQuestions = (data.questions || []).map(q => ({
    ...q,
    id: q.id || `q-${Date.now()}-${Math.random().toString(36).substring(2,7)}`
  }));

  const newQuizData = {
    title: data.title,
    description: data.description,
    courseId: data.courseId, // This can be undefined if no course is linked
    questions: generatedQuestions,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(quizzesCollection, newQuizData);
  
  // Construct the full Quiz object to return
  return {
    id: docRef.id,
    title: data.title,
    description: data.description,
    courseId: data.courseId,
    questions: generatedQuestions,
    createdAt: now.toDate().toISOString(),
    updatedAt: now.toDate().toISOString(),
  };
}

export async function updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  
  const updatePayload: any = {
    updatedAt: Timestamp.fromDate(new Date())
  };

  // Explicitly copy allowed fields to avoid unintended updates
  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.description !== undefined) updatePayload.description = data.description;
  
  // Handle courseId explicitly: if 'courseId' is a key in 'data', it means user interacted with this field.
  // It could be a string (course ID) or undefined (if "None" was selected).
  if (Object.prototype.hasOwnProperty.call(data, 'courseId')) {
    updatePayload.courseId = data.courseId;
  }

  if (data.questions) {
      updatePayload.questions = data.questions.map(q => ({
          ...q,
          id: q.id || `q-${Date.now()}-${Math.random().toString(36).substring(2,7)}`
      }));
  }
  
  await updateDoc(docRef, updatePayload);
}

export async function deleteQuiz(id: string): Promise<void> {
  const docRef = doc(db, 'quizzes', id);
  await deleteDoc(docRef);
}
