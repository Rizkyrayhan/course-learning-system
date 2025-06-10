import type { User as FirebaseUser } from 'firebase/auth';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  duration: string;
  category: string; // e.g., "Web Development", "Data Science"
  modules?: CourseModule[]; // Optional list of modules
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Could be markdown or rich text
  videoUrl?: string;
  quizId?: string; // Link to a quiz for this lesson
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // Index of the correct option in the options array
  type: 'multiple-choice' | 'true-false'; // Example question types
}

export interface Quiz {
  id:string;
  courseId?: string; // Optional: link quiz to a specific course
  title: string;
  description?: string;
  questions: Question[];
}

// User type could be extended if we store more info in Firestore
export type AppUser = FirebaseUser | null;

export interface AdminUser {
  username: string;
  // No password stored here, this is just for type checking logged in admin
}
