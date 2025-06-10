
"use client";

import { useParams } from 'next/navigation';
import QuizView from '@/components/student/QuizView';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Quiz } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { getQuizById } from '@/services/quizService';
import { useToast } from '@/hooks/use-toast';

export default function TakeQuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuizData = useCallback(async () => {
    if (!quizId) return;
    setIsLoading(true);
    try {
      const data = await getQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      toast({ title: "Error", description: "Could not load quiz.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [quizId, toast]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
