
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Quiz, Question } from "@/types";
import { Loader2, PlusCircle, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

const questionSchema = z.object({
  id: z.string().optional(), // For existing questions
  text: z.string().min(5, "Question text is too short."),
  options: z.array(z.string().min(1, "Option cannot be empty.")).min(2, "At least two options are required."),
  correctAnswerIndex: z.coerce.number().min(0, "Correct answer must be selected."),
  type: z.enum(["multiple-choice", "true-false"]).default("multiple-choice"),
});

const quizFormSchema = z.object({
  title: z.string().min(3, "Title is too short.").max(150),
  description: z.string().optional(),
  courseId: z.string().optional(), // Link to course if needed
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;

interface QuizFormProps {
  onSubmit: (data: QuizFormValues) => Promise<void>;
  initialData?: Quiz | null;
  isLoading?: boolean;
  courseOptions?: { id: string; title: string }[]; // For linking quiz to course
}

export const NONE_COURSE_VALUE = "__NONE__";

export function QuizForm({ onSubmit, initialData, isLoading = false, courseOptions = [] }: QuizFormProps) {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: initialData ? 
      { ...initialData, courseId: initialData.courseId || undefined, questions: initialData.questions.map(q => ({...q})) } : 
      { title: "", description: "", courseId: undefined, questions: [{ text: "", options: ["", ""], correctAnswerIndex: 0, type: "multiple-choice" }] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ ...initialData, courseId: initialData.courseId || undefined, questions: initialData.questions.map(q => ({...q})) });
    } else {
      form.reset({ title: "", description: "", courseId: undefined, questions: [{ text: "", options: ["", ""], correctAnswerIndex: 0, type: "multiple-choice" }] });
    }
  }, [initialData, form]);


  const addQuestion = () => {
    append({ text: "", options: ["", ""], correctAnswerIndex: 0, type: "multiple-choice" });
  };
  
  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, ""]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    if (currentOptions.length <= 2) {
      form.setError(`questions.${questionIndex}.options`, { message: "At least two options are required."});
      return;
    }
    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, newOptions);
    // Adjust correctAnswerIndex if it's out of bounds
    const correctAnswer = form.getValues(`questions.${questionIndex}.correctAnswerIndex`);
    if (correctAnswer >= newOptions.length) {
      form.setValue(`questions.${questionIndex}.correctAnswerIndex`, 0);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="font-headline">Quiz Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Introduction to HTML Basics" {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="A brief description of the quiz content." {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {courseOptions.length > 0 && (
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Course (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_COURSE_VALUE}>None</SelectItem>
                        {courseOptions.map(course => (
                          <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Separator />

        <div>
          <h3 className="text-xl font-headline mb-4">Questions</h3>
          {fields.map((field, questionIndex) => (
            <Card key={field.id} className="mb-6 shadow-md relative">
               <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => remove(questionIndex)} 
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                aria-label="Remove question"
                disabled={isLoading || fields.length <=1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardHeader><CardTitle className="font-headline text-lg">Question {questionIndex + 1}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.text`}
                  render={({ field: qField }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl><Textarea placeholder="What is ...?" {...qField} disabled={isLoading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.type`}
                  render={({ field: typeField }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                       <Select onValueChange={typeField.onChange} defaultValue={typeField.value} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Options</FormLabel>
                  {form.watch(`questions.${questionIndex}.options`).map((_, optionIndex) => (
                    <FormField
                      key={`${field.id}-option-${optionIndex}`}
                      control={form.control}
                      name={`questions.${questionIndex}.options.${optionIndex}`}
                      render={({ field: optField }) => (
                        <FormItem className="flex items-center space-x-2 mt-2">
                          <FormControl><Input placeholder={`Option ${optionIndex + 1}`} {...optField} disabled={isLoading} /></FormControl>
                          {form.watch(`questions.${questionIndex}.options`).length > 2 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(questionIndex, optionIndex)} disabled={isLoading}>
                              <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          )}
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addOption(questionIndex)} className="mt-2" disabled={isLoading}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                  </Button>
                   {form.formState.errors.questions?.[questionIndex]?.options && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {form.formState.errors.questions[questionIndex]?.options?.message || form.formState.errors.questions[questionIndex]?.options?.root?.message}
                    </p>
                   )}
                </div>

                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.correctAnswerIndex`}
                  render={({ field: answerField }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <Select onValueChange={value => answerField.onChange(parseInt(value))} defaultValue={answerField.value?.toString()} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select correct answer" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {form.watch(`questions.${questionIndex}.options`).map((opt, optIdx) => (
                            <SelectItem key={optIdx} value={optIdx.toString()}>
                              {opt || `Option ${optIdx + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={addQuestion} className="w-full" disabled={isLoading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Another Question
          </Button>
           {form.formState.errors.questions && !form.formState.errors.questions.root && fields.length === 0 && (
             <p className="text-sm font-medium text-destructive mt-1">
              {form.formState.errors.questions.message}
             </p>
           )}
        </div>

        <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Quiz" : "Create Quiz"}
        </Button>
      </form>
    </Form>
  );
}

