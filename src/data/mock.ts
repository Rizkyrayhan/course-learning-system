
import type { Announcement, Course, Quiz, Question } from '@/types';

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to EduHub!',
    content: 'Explore our new platform and start your learning journey today. We have a wide range of courses to help you achieve your goals.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  },
  {
    id: '2',
    title: 'New Course: Advanced JavaScript',
    content: 'Enroll in our latest course on Advanced JavaScript concepts, including asynchronous programming, ES6+ features, and more.',
    createdAt: new Date().toISOString(),
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development, including HTML, CSS, and JavaScript. Build your first website from scratch.',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Jane Doe',
    duration: '8 Weeks',
    category: 'Web Development',
  },
  {
    id: 'course-2',
    title: 'Python for Data Science',
    description: 'Dive into the world of data science with Python. Master libraries like NumPy, Pandas, and Matplotlib.',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'John Smith',
    duration: '12 Weeks',
    category: 'Data Science',
  },
  {
    id: 'course-3',
    title: 'Digital Marketing Fundamentals',
    description: 'Understand the core principles of digital marketing, including SEO, content marketing, and social media strategy.',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Alice Brown',
    duration: '6 Weeks',
    category: 'Marketing',
  },
];

export const mockQuestions: Question[] = [
    { id: 'q1', text: 'What is 2 + 2?', options: ['3', '4', '5'], correctAnswerIndex: 1, type: 'multiple-choice' },
    { id: 'q2', text: 'Is the sky blue?', options: ['True', 'False'], correctAnswerIndex: 0, type: 'true-false' },
    { id: 'q3', text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris'], correctAnswerIndex: 2, type: 'multiple-choice' },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    courseId: 'course-1',
    title: 'HTML Basics Quiz',
    description: 'Test your knowledge of basic HTML tags and structure.',
    questions: [
      { id: 'q1-1', text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Markup Language'], correctAnswerIndex: 0, type: 'multiple-choice' },
      { id: 'q1-2', text: 'The <p> tag is used for paragraphs.', options: ['True', 'False'], correctAnswerIndex: 0, type: 'true-false' },
    ],
  },
  {
    id: 'quiz-2',
    courseId: 'course-2',
    title: 'Python Fundamentals Quiz',
    description: 'Assess your understanding of basic Python syntax and concepts.',
    questions: [
      { id: 'q2-1', text: 'Which keyword is used to define a function in Python?', options: ['func', 'def', 'function'], correctAnswerIndex: 1, type: 'multiple-choice' },
      { id: 'q2-2', text: 'Python is a statically typed language.', options: ['True', 'False'], correctAnswerIndex: 1, type: 'true-false' },
    ],
  },
];
