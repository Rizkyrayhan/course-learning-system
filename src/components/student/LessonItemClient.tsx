
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/types';
import { Video, FileText, HelpCircle, ChevronRight } from 'lucide-react';

interface LessonItemClientProps {
  lesson: Lesson;
  lessonIndex: number;
}

export default function LessonItemClient({ lesson, lessonIndex }: LessonItemClientProps) {
  // Placeholder for view lesson logic
  const handleViewLesson = () => {
    // In a real app, this might navigate to a lesson detail page
    // or expand content inline.
    alert(`Viewing lesson: ${lesson.title}`);
  };
  
  return (
    <li className="flex items-center justify-between p-3 bg-secondary/30 rounded-md hover:bg-secondary/50 transition-colors">
      <div className="flex items-center">
        {lesson.videoUrl && <Video className="h-5 w-5 mr-3 text-accent" />}
        {!lesson.videoUrl && !lesson.quizId && <FileText className="h-5 w-5 mr-3 text-accent" />}
        {lesson.quizId && <HelpCircle className="h-5 w-5 mr-3 text-accent" />}
        <span className="text-foreground">{`${lessonIndex + 1}. ${lesson.title}`}</span>
      </div>
      {lesson.quizId ? (
        <Button variant="ghost" size="sm" asChild className="text-accent">
          <Link href={`/student/quiz/${lesson.quizId}`}>Start Quiz <ChevronRight className="h-4 w-4 ml-1" /></Link>
        </Button>
      ) : (
        <Button variant="ghost" size="sm" onClick={handleViewLesson} className="text-accent">
          View Lesson <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </li>
  );
}
