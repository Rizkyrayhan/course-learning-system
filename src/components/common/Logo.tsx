
import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-primary ${className}`}>
      <BookOpenText className="h-8 w-8" />
      <span className="font-headline text-2xl font-bold">LKP Prestasi</span>
    </Link>
  );
};

export default Logo;
