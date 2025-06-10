
"use client";

import { useState, useEffect } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AnnouncementForm } from '@/components/admin/AnnouncementForm';
import { AnnouncementTable } from '@/components/admin/AnnouncementTable';
import type { Announcement } from '@/types';
import { mockAnnouncements } from '@/data/mock'; // Using mock data
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setAnnouncements(mockAnnouncements);
  }, []);

  const handleFormSubmit = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => 
        prev.map(ann => ann.id === editingAnnouncement.id ? { ...ann, ...data } : ann)
      );
      toast({ title: "Success!", description: "Announcement updated successfully." });
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`, // Simple unique ID
        ...data,
        createdAt: new Date().toISOString(),
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      toast({ title: "Success!", description: "Announcement created successfully." });
    }
    setIsLoading(false);
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleDelete = async (announcementId: string) => {
    // Simulate API call for deletion
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnnouncements(prev => prev.filter(ann => ann.id !== announcementId));
    toast({ title: "Deleted!", description: "Announcement removed.", variant: "destructive" });
  };
  
  const openNewAnnouncementDialog = () => {
    setEditingAnnouncement(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <PageTitle title="Manage Announcements" description="Create, view, edit, and delete platform announcements.">
        <Button onClick={openNewAnnouncementDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Announcement
        </Button>
      </PageTitle>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingAnnouncement(null); // Reset editing state when dialog closes
          }
          setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
            <DialogDescription>
              {editingAnnouncement ? 'Update the details of the announcement.' : 'Fill in the details to create a new announcement.'}
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm 
            onSubmit={handleFormSubmit} 
            initialData={editingAnnouncement}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <AnnouncementTable 
        announcements={announcements} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
}
