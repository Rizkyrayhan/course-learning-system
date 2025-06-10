
import { LoginFormController } from "@/components/auth/LoginFormController";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function LoginPage() {
  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="w-full max-w-md space-y-8">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Welcome Back!</CardTitle>
              <CardDescription>Log in to continue your learning journey or manage EduHub.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginFormController />
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
                  <Link href="/register">
                    Sign up
                  </Link>
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
