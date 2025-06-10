
"use client";

import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Presentation, Settings, Users, Library } from 'lucide-react'; // Changed MessageSquare to Library
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboardPage() {
  const { admin } = useAuth();

  return (
    <div>
      <PageTitle 
        title={`Welcome, ${admin?.username || 'Admin'}!`}
        description="Manage EduHub content and settings from here."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center text-primary">
              <Presentation className="mr-3 h-6 w-6" />
              Manage Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Create, edit, and delete platform-wide announcements.</p>
            <Button asChild className="w-full">
              <Link href="/admin/announcements">Go to Announcements</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center text-primary">
              <Library className="mr-3 h-6 w-6" /> {/* Changed icon */}
              Manage Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Create, edit, and organize course content.</p>
            <Button asChild className="w-full">
              <Link href="/admin/courses">Go to Courses</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center text-primary">
              <Settings className="mr-3 h-6 w-6" />
              Manage Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Add new quizzes, update existing ones, or remove them.</p>
            <Button asChild className="w-full">
              <Link href="/admin/quizzes">Go to Quizzes</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Placeholder for future User Management */}
        <Card className="opacity-50 cursor-not-allowed">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center text-muted-foreground">
              <Users className="mr-3 h-6 w-6" />
              Manage Users (Soon)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View and manage student and instructor accounts.</p>
            <Button disabled className="w-full">Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
