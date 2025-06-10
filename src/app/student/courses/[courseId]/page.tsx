
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle, ChevronRight, Clock, FileText, Users, Video, HelpCircle, ListChecks } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import type { Course, Quiz } from '@/types';
import { getCourseById, getCourses } from '@/services/courseService';
import { getQuizzesByCourseId } from '@/services/quizService';

export async function generateStaticParams() {
  try {
    const courses = await getCourses();
    if (Array.isArray(courses)) {
      const validPaths = courses
        .filter(course => course && typeof course.id === 'string')
        .map((course) => ({
          courseId: course.id,
        }));
      if (validPaths.length === 0) {
        console.warn("generateStaticParams for courses: No valid course IDs found to generate paths. This might lead to 404s for course pages if not intended.");
      }
      return validPaths;
    }
    console.error("generateStaticParams for courses: getCourses() did not return an array. Returning empty paths.");
    return [];
  } catch (error) {
    console.error("Error in generateStaticParams for courses, returning empty paths:", error);
    return []; // Must return an array, even on error
  }
}

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const courseId = params.courseId;
  let course: Course | null = null;
  let courseQuizzes: Quiz[] = [];

  if (!courseId) {
    // This case should ideally not be reached if generateStaticParams works
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <PageTitle title="Invalid Course ID" description="No course ID was provided." />
        <Button asChild>
          <Link href="/student/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  try {
    const [courseData, quizzesData] = await Promise.all([
      getCourseById(courseId),
      getQuizzesByCourseId(courseId)
    ]);
    course = courseData;
    courseQuizzes = quizzesData;
  } catch (error) {
    console.error(`Failed to fetch course details for ${courseId}:`, error);
    // If course is not found or another error occurs, course will remain null
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <PageTitle title="Course Not Found" description="The course you are looking for does not exist, has been removed, or an error occurred while fetching it." />
        <Button asChild>
          <Link href="/student/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const modules = course.modules || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:flex lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:w-2/3">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image 
              src={course.imageUrl} 
              alt={course.title} 
              fill 
              style={{objectFit: 'cover'}}
              data-ai-hint="education learning"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-lg text-gray-200">{course.description}</p>
            </div>
          </div>

          <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground">Course Content</h2>
          {modules.length > 0 ? (
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <Card key={module.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {module.lessons && module.lessons.length > 0 ? (
                      <ul className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center">
                              {lesson.videoUrl && <Video className="h-5 w-5 mr-3 text-accent" />}
                              {!lesson.videoUrl && !lesson.quizId && <FileText className="h-5 w-5 mr-3 text-accent" />}
                              {lesson.quizId && <HelpCircle className="h-5 w-5 mr-3 text-accent" />}
                              <span className="text-foreground">{`${lessonIndex + 1}. ${lesson.title}`}</span>
                            </div>
                            {lesson.quizId ? (
                              <Button variant="ghost" size="sm" asChild className="text-accent">
                                <Link href={`/student/quiz/${lesson.quizId}`}>Start Quiz <ChevronRight className="h-4 w-4 ml-1" /></Link>
                              </Button>
                            ) : (
                               <Button variant="ghost" size="sm" asChild className="text-accent">
                                <Link href={`#`}>View Lesson <ChevronRight className="h-4 w-4 ml-1" /></Link>
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No lessons in this module yet.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No modules available for this course yet.</p>
          )}
        </div>

        {/* Sidebar with Course Info & Quizzes */}
        <aside className="lg:w-1/3 mt-8 lg:mt-0 space-y-6">
          <Card className="shadow-md sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">About this course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Instructor: <strong>{course.author}</strong></span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Duration: <strong>{course.duration}</strong></span>
              </div>
              <div className="flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Category: <strong>{course.category}</strong></span>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Enroll Now (Placeholder)</Button>
            </CardContent>
          </Card>

          {courseQuizzes.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Quizzes in this Course</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {courseQuizzes.map(quiz => (
                    <li key={quiz.id}>
                      <Button variant="link" asChild className="p-0 h-auto text-accent hover:underline justify-start w-full text-left">
                        <Link href={`/student/quiz/${quiz.id}`} className="flex items-center">
                           <HelpCircle className="h-4 w-4 mr-2 shrink-0" />
                           {quiz.title}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
