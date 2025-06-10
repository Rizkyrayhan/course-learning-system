
import type { Course } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Tag, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image 
          src={course.imageUrl} 
          alt={course.title} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint="education course" 
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl leading-tight text-primary hover:text-primary/80 transition-colors">
          <Link href={`/student/courses/${course.id}`}>{course.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground pt-1 line-clamp-3">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-accent" />
          <span>By {course.author}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-accent" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-accent" />
          <span>{course.category}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90">
          <Link href={`/student/courses/${course.id}`}>
            View Course <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
