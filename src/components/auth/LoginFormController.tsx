
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const studentLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type StudentLoginFormValues = z.infer<typeof studentLoginFormSchema>;

const adminLoginFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type AdminLoginFormValues = z.infer<typeof adminLoginFormSchema>;

export function LoginFormController() {
  const { toast } = useToast();
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("student");

  const studentForm = useForm<StudentLoginFormValues>({
    resolver: zodResolver(studentLoginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const adminForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onStudentSubmit(data: StudentLoginFormValues) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login Successful!", description: "Welcome back to LKP Prestasi." });
      router.push("/student/dashboard");
    } catch (error: any) {
      console.error("Student login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or network issue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onAdminSubmit(data: AdminLoginFormValues) {
    setIsLoading(true);
    const success = await loginAdmin(data.username, data.password);
    if (success) {
      toast({ title: "Admin Login Successful!", description: "Welcome, Admin." });
      router.push("/admin/dashboard");
    } else {
      toast({
        title: "Admin Login Failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <Form {...studentForm}>
          <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-6 pt-4">
            <FormField
              control={studentForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="student@example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Student
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="admin">
        <Form {...adminForm}>
          <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6 pt-4">
            <FormField
              control={adminForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Admin" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={adminForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="admin123" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Admin
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
