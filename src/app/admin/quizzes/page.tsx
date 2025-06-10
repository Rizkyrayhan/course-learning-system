
"use client";

import { useState, useEffect } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuizForm, type QuizFormValues, NONE_COURSE_VALUE } from '@/components/admin/QuizForm';
import { QuizTable } from '@/components/admin/QuizTable';
import type { Quiz } from '@/types';
import { mockQuizzes, mockCourses } from '@/data/mock'; // Using mock data
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const courseOptions = mockCourses.map(course => ({ id: course.id, title: course.title }));


  useEffect(() => {
    // Simulate fetching data
    setQuizzes(mockQuizzes);
  }, []);

  const handleFormSubmit = async (data: QuizFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const finalCourseId = data.courseId === NONE_COURSE_VALUE ? undefined : data.courseId;
    const submissionData = { ...data, courseId: finalCourseId };

    if (editingQuiz) {
      // Update existing quiz
      setQuizzes(prev => 
        prev.map(q => q.id === editingQuiz.id ? { ...q, ...submissionData, questions: submissionData.questions.map(ques => ({...ques, id: ques.id || `q-${Date.now()}-${Math.random()}`})) } : q)
      );
      toast({ title: "Success!", description: "Quiz updated successfully." });
    } else {
      // Create new quiz
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`, // Simple unique ID
        ...submissionData,
        questions: submissionData.questions.map(ques => ({...ques, id: `q-${Date.now()}-${Math.random()}`})),
      };
      setQuizzes(prev => [newQuiz, ...prev]);
      toast({ title: "Success!", description: "Quiz created successfully." });
    }
    setIsLoading(false);
    setIsDialogOpen(false);
    setEditingQuiz(null);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsDialogOpen(true);
  };

  const handleDelete = async (quizId: string) => {
    // Simulate API call for deletion
    await new Promise(resolve => setTimeout(resolve, 500));
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    toast({ title: "Deleted!", description: "Quiz removed.", variant: "destructive" });
  };
  
  const openNewQuizDialog = () => {
    setEditingQuiz(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <PageTitle title="Manage Quizzes" description="Create, view, edit, and delete quizzes for courses.">
        <Button onClick={openNewQuizDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Quiz
        </Button>
      </PageTitle>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingQuiz(null); // Reset editing state when dialog closes
          }
          setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </DialogTitle>
            <DialogDescription>
              {editingQuiz ? 'Update the details of the quiz.' : 'Fill in the details to create a new quiz.'}
            </DialogDescription>
          </DialogHeader>
          <QuizForm 
            onSubmit={handleFormSubmit} 
            initialData={editingQuiz}
            isLoading={isLoading}
            courseOptions={courseOptions}
          />
        </DialogContent>
      </Dialog>

      <QuizTable 
        quizzes={quizzes} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
}

