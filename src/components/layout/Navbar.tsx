
"use client";

import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookMarked, Presentation, Settings, Users, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, admin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const commonLinks = [
    { href: '/', label: 'Home', icon: <BookMarked className="mr-2 h-4 w-4" /> },
    // { href: '/courses', label: 'Courses', icon: <Presentation className="mr-2 h-4 w-4" /> }, // Public courses page
  ];

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: '/student/my-courses', label: 'My Courses', icon: <BookMarked className="mr-2 h-4 w-4" /> },
    // { href: '/student/quizzes', label: 'My Quizzes', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: '/admin/announcements', label: 'Announcements', icon: <Presentation className="mr-2 h-4 w-4" /> },
    { href: '/admin/quizzes', label: 'Quizzes', icon: <Settings className="mr-2 h-4 w-4" /> },
    // { href: '/admin/users', label: 'Users', icon: <Users className="mr-2 h-4 w-4" /> }, // If user management is added
  ];
  
  let navLinks = commonLinks;
  if (user) navLinks = studentLinks;
  if (admin) navLinks = adminLinks;


  const renderLinks = (isMobile = false) => (
    navLinks.map((link) => (
      <Button key={link.href} variant={isMobile ? "ghost" : "ghost"} asChild className={isMobile ? "justify-start w-full text-left" : ""}>
        <Link href={link.href} onClick={() => isMobile && setMobileMenuOpen(false)}>
          {isMobile && link.icon}
          {link.label}
        </Link>
      </Button>
    ))
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {renderLinks()}
        </nav>
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
          ) : user || admin ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-10">
                <nav className="flex flex-col space-y-3">
                  {renderLinks(true)}
                  {!user && !admin && !loading && (
                    <>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
