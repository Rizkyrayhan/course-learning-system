
import QuizView from '@/components/student/QuizView';
import { AlertCircle } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Quiz } from '@/types';
import { getQuizById, getQuizzes } from '@/services/quizService';
// Toasts would need to be handled in QuizView or a child client component.

export async function generateStaticParams() {
  try {
    const quizzes = await getQuizzes();
    return quizzes.map((quiz) => ({
      quizId: quiz.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for quizzes:", error);
    return [];
  }
}

export default async function TakeQuizPage({ params }: { params: { quizId: string } }) {
  const quizId = params.quizId;
  let quiz: Quiz | null = null;

  try {
    // Fetch data directly as this is a Server Component
    quiz = await getQuizById(quizId);
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    // Error handling can be more sophisticated.
    // If quiz remains null, the "Quiz Not Found" message will show.
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
