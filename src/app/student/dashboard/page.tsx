
"use client";

import PageTitle from '@/components/common/PageTitle';
import CourseCard from '@/components/student/CourseCard';
import { useAuth } from '@/hooks/useAuth';
import type { Course } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { getCourses } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoursesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({ title: "Error", description: "Could not fetch courses.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCoursesData();
  }, [fetchCoursesData]);

  return (
    <div>
      <PageTitle 
        title={`Welcome, ${user?.displayName || 'Student'}!`}
        description="Explore your courses and continue your learning journey."
      />
      
      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground">Available Courses</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No courses available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
