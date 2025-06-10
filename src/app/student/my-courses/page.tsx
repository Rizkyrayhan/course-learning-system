
"use client";

import PageTitle from '@/components/common/PageTitle';
import CourseCard from '@/components/student/CourseCard';
import { mockCourses } from '@/data/mock'; // Using mock data for now
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function MyCoursesPage() {
  // In a real app, fetch courses the student is enrolled in
  const enrolledCourses = mockCourses.slice(0,1); // Simulate 1 enrolled course

  return (
    <div>
      <PageTitle 
        title="My Enrolled Courses"
        description="Pick up where you left off or review completed material."
      />
      
      <section>
        {enrolledCourses.length > 0 ? (
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
