
import { StudentRegisterForm } from "@/components/auth/StudentRegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import AuthRedirect from "@/components/auth/AuthRedirect";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="w-full max-w-md space-y-8">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Create an Account</CardTitle>
              <CardDescription>Join LKP Prestasi and start your learning adventure!</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentRegisterForm />
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
                  <Link href="/login">
                    Log in
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
