
import { db } from '@/lib/firebase';
import type { Course, CourseModule, Lesson } from '@/types';
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

const mapCourseDocument = (docSnap: any): Course => {
  const data = docSnap.data();
  const modules = (data.modules || []).map((module: any): CourseModule => ({
    id: module.id || `module-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: module.title || '',
    lessons: (module.lessons || []).map((lesson: any): Lesson => ({
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
};

export async function getCourses(): Promise<Course[]> {
  const q = query(coursesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCourseDocument);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const docRef = doc(db, 'courses', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return mapCourseDocument(docSnap);
  }
  return null;
}

export async function addCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  const newCourseData = {
    ...data,
    // Ensure modules and lessons have IDs if not provided, although form should handle this
    modules: (data.modules || []).map(m => ({
        ...m,
        id: m.id || `module-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        lessons: (m.lessons || []).map(l => ({
            ...l,
            id: l.id || `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        }))
    })),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  };
  const docRef = await addDoc(coursesCollection, newCourseData);
  // Constructing the return object similar to addAnnouncement
  return {
    id: docRef.id,
    ...data, // original data
    createdAt: newCourseData.createdAt.toDate().toISOString(),
    updatedAt: newCourseData.updatedAt.toDate().toISOString(),
    // ensure modules in returned object match the structure if needed (data.modules might be slightly different than newCourseData.modules if IDs were generated)
    modules: newCourseData.modules,
  };
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, 'courses', id);
  // Ensure modules and lessons within data have IDs if they are being updated
   const updateData = {
    ...data,
    updatedAt: Timestamp.fromDate(new Date())
  };
  if (data.modules) {
    updateData.modules = data.modules.map(m => ({
        ...m,
        id: m.id || `module-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        lessons: (m.lessons || []).map(l => ({
            ...l,
            id: l.id || `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        }))
    }));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteCourse(id: string): Promise<void> {
  const docRef = doc(db, 'courses', id);
  await deleteDoc(docRef);
}
