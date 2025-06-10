
"use client";

import { Button } from "@/components/ui/button";

// This is a placeholder. In a real app, this would handle enrollment logic.
export default function CourseEnrollButton() {
  const handleEnroll = () => {
    // Placeholder: In a real app, this would interact with a service
    // to enroll the user in the course.
    alert("Enrollment feature coming soon!");
  };

  return (
    <Button 
      onClick={handleEnroll} 
      className="w-full mt-4 bg-primary hover:bg-primary/90"
    >
      Enroll Now (Placeholder)
    </Button>
  );
}
