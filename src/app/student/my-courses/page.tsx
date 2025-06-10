
"use client";

import PageTitle from '@/components/common/PageTitle';
import CourseCard from '@/components/student/CourseCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import type { Course } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { getCourses } from '@/services/courseService'; // Assuming "my courses" for now means all courses for simplicity
import { useToast } from '@/hooks/use-toast';

export default function MyCoursesPage() {
  // In a real app, fetch courses the student is enrolled in.
  // For now, we'll show all courses or a subset as a placeholder for "enrolled".
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchEnrolledCoursesData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Placeholder: fetch all courses. Replace with actual enrollment logic later.
      const allCourses = await getCourses();
      // Simulate enrollment by taking a slice or applying some filter if needed
      setEnrolledCourses(allCourses.slice(0,3)); // Example: show first 3 as "enrolled"
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
      toast({ title: "Error", description: "Could not fetch your courses.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEnrolledCoursesData();
  }, [fetchEnrolledCoursesData]);

  return (
    <div>
      <PageTitle 
        title="My Enrolled Courses"
        description="Pick up where you left off or review completed material."
      />
      
      <section>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
           <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">No Enrolled Courses Yet</AlertTitle>
            <AlertDescription className="text-primary/80">
              You haven&apos;t enrolled in any courses. Explore available courses from the dashboard!
            </AlertDescription>
          </Alert>
        )}
      </section>
    </div>
  );
}
