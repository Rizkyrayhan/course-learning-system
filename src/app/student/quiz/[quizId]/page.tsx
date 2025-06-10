
"use client";

import { useParams } from 'next/navigation';
import { mockQuizzes } from '@/data/mock'; // Using mock data
import QuizView from '@/components/student/QuizView';
import { AlertCircle } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TakeQuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  
  const quiz = mockQuizzes.find(q => q.id === quizId);

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <PageTitle title="Quiz Not Found" description="The quiz you are looking for does not exist or is no longer available." />
         <Button asChild>
          <Link href="/student/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuizView quiz={quiz} />
    </div>
  );
}
