
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
import { CourseForm, type CourseFormValues } from '@/components/admin/CourseForm';
import { CourseTable } from '@/components/admin/CourseTable';
import type { Course, CourseModule } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '@/services/courseService';

const generateDefaultModules = (): CourseModule[] => [
  {
    id: `module-${Date.now()}-1`,
    title: 'Module 1: Introduction',
    lessons: [
      { id: `lesson-${Date.now()}-1-1`, title: 'Welcome to the Course', content: 'Basic introduction to the course topics.' },
      { id: `lesson-${Date.now()}-1-2`, title: 'Core Concepts', content: 'Understanding the fundamental ideas.' },
    ]
  },
  {
    id: `module-${Date.now()}-2`,
    title: 'Module 2: Getting Started',
    lessons: [
      { id: `lesson-${Date.now()}-2-1`, title: 'First Steps', content: 'Practical exercises to begin.' },
    ]
  },
];


export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const fetchCoursesData = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({ title: "Error", description: "Could not fetch courses.", variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCoursesData();
  }, [fetchCoursesData]);

  const handleFormSubmit = async (data: CourseFormValues) => {
    setIsLoading(true);
    try {
      if (editingCourse) {
        // Retain existing modules if editing, or add default if they are missing (e.g. from an older course entry)
        const modules = editingCourse.modules && editingCourse.modules.length > 0 ? editingCourse.modules : generateDefaultModules();
        await updateCourse(editingCourse.id, {...data, modules });
        toast({ title: "Success!", description: "Course updated successfully." });
      } else {
        const newCourseData = { ...data, modules: generateDefaultModules() };
        await addCourse(newCourseData as Omit<Course, 'id' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success!", description: "Course created successfully." });
      }
      fetchCoursesData();
      setIsDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Failed to submit course:", error);
      toast({ title: "Error", description: "Could not save course.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    setIsLoading(true);
    try {
      await deleteCourse(courseId);
      toast({ title: "Deleted!", description: "Course removed.", variant: "destructive" });
      fetchCoursesData();
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast({ title: "Error", description: "Could not delete course.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openNewCourseDialog = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <PageTitle title="Manage Courses" description="Create, view, edit, and delete platform courses.">
        <Button onClick={openNewCourseDialog} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </PageTitle>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingCourse(null);
          }
          setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Update the details of the course.' : 'Fill in the details to create a new course.'}
            </DialogDescription>
          </DialogHeader>
          <CourseForm 
            onSubmit={handleFormSubmit} 
            initialData={editingCourse}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {isFetching ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CourseTable 
          courses={courses} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}
