
import type { Announcement } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">{announcement.title}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
          <CalendarDays className="mr-2 h-4 w-4" />
          Posted on {format(new Date(announcement.createdAt), 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed">{announcement.content}</p>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
