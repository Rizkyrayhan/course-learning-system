
"use client";

import { useState, useEffect, useCallback } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnnouncementForm } from '@/components/admin/AnnouncementForm';
import { AnnouncementTable } from '@/components/admin/AnnouncementTable';
import type { Announcement } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
// Import client-side service functions
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/services/announcementService';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const fetchAnnouncementsData = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await getAnnouncements(); // Now calls client-side Firestore
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      toast({ title: "Error", description: "Could not fetch announcements.", variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnnouncementsData();
  }, [fetchAnnouncementsData]);

  const handleFormSubmit = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, data); // Now calls client-side Firestore
        toast({ title: "Success!", description: "Announcement updated successfully." });
      } else {
        await addAnnouncement(data); // Now calls client-side Firestore
        toast({ title: "Success!", description: "Announcement created successfully." });
      }
      fetchAnnouncementsData(); // Re-fetch data
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error("Failed to submit announcement:", error);
      toast({ title: "Error", description: "Could not save announcement.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleDelete = async (announcementId: string) => {
    setIsLoading(true); 
    try {
      await deleteAnnouncement(announcementId); // Now calls client-side Firestore
      toast({ title: "Deleted!", description: "Announcement removed.", variant: "destructive" });
      fetchAnnouncementsData(); 
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      toast({ title: "Error", description: "Could not delete announcement.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openNewAnnouncementDialog = () => {
    setEditingAnnouncement(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <PageTitle title="Manage Announcements" description="Create, view, edit, and delete platform announcements.">
        <Button onClick={openNewAnnouncementDialog} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Announcement
        </Button>
      </PageTitle>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingAnnouncement(null);
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

      {isFetching ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <AnnouncementTable 
          announcements={announcements} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}
