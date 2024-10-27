"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC = () => {
  const router = useRouter();

  const isActive = (pathname: string): boolean => router.pathname === pathname;

  return (
    <nav className="p-4">
      <div className="flex gap-4">
        <Link href="/" passHref>
          <Button className={isActive('/') ? 'bg-blue-500 text-white' : 'bg-gray-200'}>
            Home
          </Button>
        </Link>
        <Link href="/about" passHref>
          <Button className={isActive('/about') ? 'bg-blue-500 text-white' : 'bg-gray-200'}>
            About
          </Button>
        </Link>
        <Link href="/contact" passHref>
          <Button className={isActive('/contact') ? 'bg-blue-500 text-white' : 'bg-gray-200'}>
            Contact
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
