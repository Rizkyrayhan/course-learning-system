
import QuizView from '@/components/student/QuizView';
import { AlertCircle } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Quiz } from '@/types';
import { getQuizById, getQuizzes } from '@/services/quizService';

export async function generateStaticParams() {
  try {
    const quizzes = await getQuizzes();
    if (Array.isArray(quizzes)) {
      const validPaths = quizzes
        .filter(quiz => quiz && typeof quiz.id === 'string')
        .map((quiz) => ({
          quizId: quiz.id,
        }));
      if (validPaths.length === 0) {
          console.warn("generateStaticParams for quizzes: No valid quiz IDs found to generate paths. This might lead to 404s for quiz pages if not intended.");
      }
      return validPaths;
    }
    console.error("generateStaticParams for quizzes: getQuizzes() did not return an array. Returning empty paths.");
    return [];
  } catch (error) {
    console.error("Error in generateStaticParams for quizzes, returning empty paths:", error);
    return []; // Must return an array, even on error
  }
}

export default async function TakeQuizPage({ params }: { params: { quizId: string } }) {
  const quizId = params.quizId;
  let quiz: Quiz | null = null;

  if (!quizId) {
    // This case should ideally not be reached
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <PageTitle title="Invalid Quiz ID" description="No quiz ID was provided." />
         <Button asChild>
          <Link href="/student/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  try {
    quiz = await getQuizById(quizId);
  } catch (error) {
    console.error(`Failed to fetch quiz ${quizId}:`, error);
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <PageTitle title="Quiz Not Found" description="The quiz you are looking for does not exist, is no longer available, or an error occurred while fetching it." />
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
