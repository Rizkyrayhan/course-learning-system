
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
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const modules = (data.modules || []).map((module: any) => ({
      id: module.id || `module-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: module.title || '',
      lessons: (module.lessons || []).map((lesson: any) => ({
        id: lesson.id || `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: lesson.title || '',
        content: lesson.content || '',
        videoUrl: lesson.videoUrl,
        quizId: lesson.quizId,
      })),
    }));
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      author: data.author,
      duration: data.duration,
      category: data.category,
      modules: modules,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt && (data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt),
    } as Course;
  });
}

export async function getCourseById(id: string): Promise<Course | null> {
  const docRef = doc(db, 'courses', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const modules = (data.modules || []).map((module: any) => ({
      id: module.id || `module-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: module.title || '',
      lessons: (module.lessons || []).map((lesson: any) => ({
        id: lesson.id || `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: lesson.title || '',
        content: lesson.content || '',
        videoUrl: lesson.videoUrl,
        quizId: lesson.quizId,
      })),
    }));
    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      author: data.author,
      duration: data.duration,
      category: data.category,
      modules: modules,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt && (data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt),
    } as Course;
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
