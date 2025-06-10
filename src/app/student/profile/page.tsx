
"use client";

import PageTitle from '@/components/common/PageTitle';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, User, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>; 
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div>
      <PageTitle 
        title="My Profile"
        description="View and manage your account details."
      />
      
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback className="text-3xl font-headline">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">{user.displayName || 'User Name'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</Label>
            <Input id="fullName" value={user.displayName || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email Address</Label>
            <Input id="email" type="email" value={user.email || ''} readOnly />
          </div>
          {user.metadata.creationTime && (
            <div className="space-y-2">
               <Label htmlFor="creationTime" className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Member Since</Label>
               <Input id="creationTime" value={format(new Date(user.metadata.creationTime), 'PPP')} readOnly />
            </div>
          )}
          {/* Add more profile fields or edit functionality here */}
          <Button className="w-full" disabled>Update Profile (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
