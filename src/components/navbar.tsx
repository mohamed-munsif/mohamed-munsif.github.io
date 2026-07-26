'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItem = {
  id: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
];

const PILL_INSET = 16;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('about');
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const [bubblePulse, setBubblePulse] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const pillContainerRef = useRef<HTMLDivElement | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const scrollSpyPausedRef = useRef(false);
  const resumeScrollSpyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const updateActiveSection = () => {
      if (scrollSpyPausedRef.current) {
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      let currentSection = navItems[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of navItems) {
        const section = document.getElementById(item.id);

        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          currentSection = item.id;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [pathname]);

  const effectiveSection = hoveredSection ?? activeSection;

  useLayoutEffect(() => {
    const activeLabel = labelRefs.current[effectiveSection];
    const pillContainer = pillContainerRef.current;

    if (!activeLabel || !pillContainer) {
      return;
    }

    const labelRect = activeLabel.getBoundingClientRect();
    const containerRect = pillContainer.getBoundingClientRect();

    setPillStyle({
      left: labelRect.left - containerRect.left + labelRect.width / 2,
      width: labelRect.width + PILL_INSET * 2,
    });
  }, [effectiveSection]);

  useEffect(() => {
    const handleResize = () => {
      const activeLabel = labelRefs.current[effectiveSection];
      const pillContainer = pillContainerRef.current;

      if (!activeLabel || !pillContainer) {
        return;
      }

      const labelRect = activeLabel.getBoundingClientRect();
      const containerRect = pillContainer.getBoundingClientRect();

      setPillStyle({
        left: labelRect.left - containerRect.left + labelRect.width / 2,
        width: labelRect.width + PILL_INSET * 2,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [effectiveSection]);

  useEffect(() => {
    if (pathname === '/' && pendingScroll) {
      const timer = setTimeout(() => {
        const section = document.getElementById(pendingScroll);

        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          const offsetPosition = window.pageYOffset + sectionTop - 100;

          try {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
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

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        window.clearTimeout(pulseTimerRef.current);
      }

      if (resumeScrollSpyTimerRef.current) {
        window.clearTimeout(resumeScrollSpyTimerRef.current);
      }
    };
  }, []);

  const handleScrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    setBubblePulse(true);
    scrollSpyPausedRef.current = true;

    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }

    pulseTimerRef.current = window.setTimeout(() => {
      setBubblePulse(false);
      pulseTimerRef.current = null;
    }, 240);

    if (resumeScrollSpyTimerRef.current) {
      window.clearTimeout(resumeScrollSpyTimerRef.current);
    }

    resumeScrollSpyTimerRef.current = window.setTimeout(() => {
      scrollSpyPausedRef.current = false;
      resumeScrollSpyTimerRef.current = null;
    }, pathname === '/' ? 900 : 1100);

    if (pathname !== '/') {
      setPendingScroll(sectionId);
      router.push('/');
      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      requestAnimationFrame(() => {
        const sectionTop = section.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + sectionTop - 100;

        try {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        } catch {
          window.scrollTo(0, offsetPosition);
        }
      });
    }
  }, [router, pathname]);

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 px-4 sm:top-5 sm:px-6">
      <div className={`mx-auto w-full max-w-sm transition-all duration-500 ease-out ${isScrolled ? 'translate-y-0 scale-[0.995]' : 'translate-y-0'}`}>
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <filter id="liquid-distort-navbar" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <div
          className="relative overflow-hidden rounded-full border border-white/15 bg-white/8 px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.35)] dark:border-white/10 dark:bg-black/15"
          style={{
            backdropFilter: 'url(#liquid-distort-navbar) blur(16px) saturate(170%)',
            WebkitBackdropFilter: 'blur(16px) saturate(170%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-100" />

          <TooltipProvider>
            <div className="relative flex items-center justify-center gap-3 sm:gap-4">
              <div ref={pillContainerRef} className="relative flex min-w-0 items-center justify-center gap-1 rounded-full px-1 py-1">
                {pillStyle && (
                  <div
                    className={`absolute top-1 h-[calc(100%-0.5rem)] rounded-full bg-gradient-to-b from-white/22 via-white/14 to-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_18px_rgba(0,0,0,0.16)] transition-[left,width,opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-sm will-change-[left,width,transform] transform-gpu -translate-x-1/2 ${bubblePulse ? 'scale-[1.06]' : 'scale-100'}`}
                    style={{ left: pillStyle.left, width: pillStyle.width }}
                  />
                )}

                <div
                  className="relative flex items-center justify-center gap-1 sm:gap-2"
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`#${item.id}`}
                      className={`relative z-10 rounded-full px-2 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300 ease-out sm:px-3 sm:py-2 sm:text-sm ${(hoveredSection ?? activeSection) === item.id ? 'text-foreground' : 'text-foreground/60 hover:text-foreground/90'}`}
                      onMouseEnter={() => setHoveredSection(item.id)}
                      onClick={(e) => handleScrollToSection(e, item.id)}
                    >
                      <span
                        ref={(element) => {
                          labelRefs.current[item.id] = element;
                        }}
                        className="inline-block"
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  <div className="mx-1 h-5 w-px bg-white/15" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/8 text-foreground/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:bg-white/12 sm:h-10 sm:w-10">
                        <ThemeToggle />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Theme</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
}