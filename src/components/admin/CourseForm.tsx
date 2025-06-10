
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Course } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(150),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  duration: z.string().min(1, { message: "Duration is required." }), // e.g., "8 Weeks", "10 Hours"
  category: z.string().min(2, { message: "Category is required." }),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  onSubmit: (data: CourseFormValues) => Promise<void>;
  initialData?: Course | null;
  isLoading?: boolean;
}

export function CourseForm({ onSubmit, initialData, isLoading = false }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData ? 
      { 
        title: initialData.title, 
        description: initialData.description,
        imageUrl: initialData.imageUrl,
        author: initialData.author,
        duration: initialData.duration,
        category: initialData.category,
      } : 
      {
        title: "",
        description: "",
        imageUrl: "https://placehold.co/600x400.png",
        author: "",
        duration: "",
        category: "",
      },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ 
        title: initialData.title, 
        description: initialData.description,
        imageUrl: initialData.imageUrl,
        author: initialData.author,
        duration: initialData.duration,
        category: initialData.category,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        imageUrl: "https://placehold.co/600x400.png",
        author: "",
        duration: "",
        category: "",
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to React" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the course content and learning objectives..."
                  className="resize-y min-h-[100px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/course-image.png" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author/Instructor</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 8 Weeks, 20 Hours" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Development, Data Science" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}
