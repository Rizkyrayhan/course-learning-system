
"use client";

import { useState, useEffect, useCallback } from 'react';
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
import type { Quiz, Course } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { getQuizzes, addQuiz, updateQuiz, deleteQuiz } from '@/services/quizService';
import { getCourses } from '@/services/courseService';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const courseOptions = courses.map(course => ({ id: course.id, title: course.title }));

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [quizzesData, coursesData] = await Promise.all([
        getQuizzes(),
        getCourses()
      ]);
      setQuizzes(quizzesData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: "Error", description: "Could not fetch quizzes or courses.", variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async (data: QuizFormValues) => {
    setIsLoading(true);
    const finalCourseId = data.courseId === NONE_COURSE_VALUE ? undefined : data.courseId;
    const submissionData = { 
      ...data, 
      courseId: finalCourseId,
      questions: data.questions.map(ques => ({
        ...ques, 
        id: ques.id || `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      })) 
    };

    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, submissionData);
        toast({ title: "Success!", description: "Quiz updated successfully." });
      } else {
        await addQuiz(submissionData as Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success!", description: "Quiz created successfully." });
      }
      fetchData(); // Re-fetch data
      setIsDialogOpen(false);
      setEditingQuiz(null);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toast({ title: "Error", description: "Could not save quiz.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsDialogOpen(true);
  };

  const handleDelete = async (quizId: string) => {
    setIsLoading(true);
    try {
      await deleteQuiz(quizId);
      toast({ title: "Deleted!", description: "Quiz removed.", variant: "destructive" });
      fetchData(); // Re-fetch data
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast({ title: "Error", description: "Could not delete quiz.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openNewQuizDialog = () => {
    setEditingQuiz(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <PageTitle title="Manage Quizzes" description="Create, view, edit, and delete quizzes for courses.">
        <Button onClick={openNewQuizDialog} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Quiz
        </Button>
      </PageTitle>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingQuiz(null);
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

      {isFetching ? (
         <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <QuizTable 
          quizzes={quizzes} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}
