
"use client";

import PageTitle from '@/components/common/PageTitle';
import CourseCard from '@/components/student/CourseCard';
import { mockCourses } from '@/data/mock'; // Using mock data
import { useAuth } from '@/hooks/useAuth';

export default function StudentDashboardPage() {
  const { user } = useAuth(); // Get student user details if needed

  return (
    <div>
      <PageTitle 
        title={`Welcome, ${user?.displayName || 'Student'}!`}
        description="Explore your courses and continue your learning journey."
      />
      
      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground">Available Courses</h2>
        {mockCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses.map((course) => (
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
