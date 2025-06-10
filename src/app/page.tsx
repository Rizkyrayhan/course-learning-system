
"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import AnnouncementCard from '@/components/common/AnnouncementCard';
import { mockAnnouncements, mockCourses } from '@/data/mock'; // Using mock data
import { ArrowRight, BookOpenCheck, Users, Zap } from 'lucide-react';
import CourseCard from '@/components/student/CourseCard'; // Re-using for homepage display

export default function HomePage() {
  // For demonstration, we'll show a few courses on the homepage
  const featuredCourses = mockCourses.slice(0, 3);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Unlock Your Potential with EduHub
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Your journey to knowledge and skill mastery starts here. Explore courses designed by experts.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-background text-primary hover:bg-background/90 shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/login">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
            Why Choose EduHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
              <BookOpenCheck className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-headline text-xl font-semibold mb-2 text-foreground">Expert-Led Courses</h3>
              <p className="text-muted-foreground">Learn from industry professionals with real-world experience.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
              <Zap className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-headline text-xl font-semibold mb-2 text-foreground">Interactive Learning</h3>
              <p className="text-muted-foreground">Engage with quizzes, projects, and a supportive community.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
              <Users className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-headline text-xl font-semibold mb-2 text-foreground">Flexible Pacing</h3>
              <p className="text-muted-foreground">Learn at your own speed, anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground">
              Featured Courses
            </h2>
            <Button variant="link" asChild className="text-accent hover:text-accent/80">
              <Link href="/login">View All Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>


      {/* Announcements Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
            Latest Announcements
          </h2>
          {mockAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {mockAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No announcements at the moment.</p>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 md:py-32 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of learners and take your skills to the next level.
          </p>
          <Button size="lg" asChild className="bg-background text-accent hover:bg-background/90 shadow-lg transform hover:scale-105 transition-transform">
            <Link href="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
