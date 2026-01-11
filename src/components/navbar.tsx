'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Brain, BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle pending scroll when pathname changes
  useEffect(() => {
    if (pathname === '/' && pendingScroll) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        const section = document.getElementById(pendingScroll);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          const offsetPosition = window.pageYOffset + sectionTop - 100;
          
          try {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } catch {
            window.scrollTo(0, offsetPosition);
          }
        }
        setPendingScroll(null);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, pendingScroll]);

  // Handle smooth scrolling when clicking on navbar links
  const handleScrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // If we're not on the homepage, navigate to homepage first
    if (pathname !== '/') {
      setPendingScroll(sectionId);
      router.push('/');
      return;
    }
    
    // If we're on homepage, scroll to section immediately
    const section = document.getElementById(sectionId);
    
    if (section) {
      requestAnimationFrame(() => {
        const sectionTop = section.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + sectionTop - 100;
        
        try {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } catch {
          window.scrollTo(0, offsetPosition);
        }
      });
    }
  }, [router, pathname]);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-fit px-4 sm:px-6">
      <div className="transition-all duration-300 ease-in-out">
        <div 
          className={`transition-all duration-400 ease-out rounded-2xl ${
            isScrolled 
              ? 'bg-white/10 dark:bg-black/10 backdrop-blur-[20px] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),0_8px_16px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.1),0_8px_16px_0_rgba(0,0,0,0.3)]' 
              : 'bg-transparent backdrop-blur-0'
          }`}
        >
          <div className="flex h-12 sm:h-14 items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Desktop and Mobile menu */}
            <TooltipProvider>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 justify-center">
              <Link 
                href="#about" 
                className="hover:text-primary text-xs sm:text-sm md:text-base whitespace-nowrap px-1 transition-colors duration-200"
                onClick={(e) => handleScrollToSection(e, 'about')}
              >
                About
              </Link>
              <Link 
                href="#projects" 
                className="hover:text-primary text-xs sm:text-sm md:text-base whitespace-nowrap px-1 transition-colors duration-200"
                onClick={(e) => handleScrollToSection(e, 'projects')}
              >
                Projects
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/streak"
                    className="hover:text-primary flex items-center justify-center w-8 h-8 transition-colors duration-200"
                    aria-label="My Streak"
                  >
                    <Brain className="w-4 h-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>My Streak</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/blogs"
                    className="hover:text-primary flex items-center justify-center w-8 h-8 transition-colors duration-200"
                    aria-label="Blogs"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Blogs</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hover:text-primary flex items-center justify-center w-8 h-8 transition-colors duration-200">
                    <ThemeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </nav>
  );
}
