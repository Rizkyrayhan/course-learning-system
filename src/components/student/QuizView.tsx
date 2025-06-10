
"use client";

import type { Quiz, Question } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface QuizViewProps {
  quiz: Quiz;
}

const QuizView = ({ quiz }: QuizViewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQuestionIndex] === null) {
        toast({
            title: "No Answer Selected",
            description: "Please select an answer before proceeding.",
            variant: "destructive",
        });
        return;
    }
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question, submit quiz
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswers[currentQuestionIndex] === null && currentQuestionIndex === quiz.questions.length -1) {
         toast({
            title: "No Answer Selected",
            description: "Please select an answer for the last question.",
            variant: "destructive",
        });
        return;
    }

    let calculatedScore = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setShowResults(true);
    toast({
        title: "Quiz Submitted!",
        description: `You scored ${calculatedScore} out of ${quiz.questions.length}.`,
    });
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">Quiz Results: {quiz.title}</CardTitle>
          <CardDescription>You scored {score} out of {quiz.questions.length}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((q, index) => (
              <div key={q.id} className={`p-4 rounded-md ${selectedAnswers[index] === q.correctAnswerIndex ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                <p className="font-semibold">{index + 1}. {q.text}</p>
                <p className="text-sm">Your answer: {selectedAnswers[index] !== null ? q.options[selectedAnswers[index]!] : 'Not answered'}</p>
                <p className="text-sm">Correct answer: {q.options[q.correctAnswerIndex]}</p>
                {selectedAnswers[index] === q.correctAnswerIndex ? 
                    <CheckCircle className="inline-block h-5 w-5 text-green-600" /> : 
                    <XCircle className="inline-block h-5 w-5 text-red-600" />}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push(`/student/courses/${quiz.courseId || ''}`)}>Back to Course</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-center text-primary">{quiz.title}</CardTitle>
        {quiz.description && <CardDescription className="text-center">{quiz.description}</CardDescription>}
        <div className="pt-4">
            <Label htmlFor="quiz-progress" className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Label>
            <Progress value={progressValue} id="quiz-progress" className="w-full mt-1" />
        </div>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        <p className="font-semibold text-lg mb-6">{currentQuestionIndex + 1}. {currentQuestion.text}</p>
        <RadioGroup 
            value={selectedAnswers[currentQuestionIndex]?.toString()} 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`q${currentQuestionIndex}-option${index}`} />
              <Label htmlFor={`q${currentQuestionIndex}-option${index}`} className="flex-1 cursor-pointer text-base">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button onClick={handleNextQuestion}>
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizView;
