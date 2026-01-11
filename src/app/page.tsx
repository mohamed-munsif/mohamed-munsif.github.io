'use client';

import { useEffect, useState } from 'react';
import { Projects } from '@/components/projects';
import { About } from '@/components/about';
import { Education } from '@/components/education';
import { Experience } from '@/components/experience';
import { SkeletonDemo, SkeletonCard } from '@/components/ui/skeleton';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-[800px] mx-auto p-6">
          <div className="pt-24 space-y-8">
            <SkeletonDemo />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[800px] mx-auto p-6">
        {/* About Section */}
        <About />

        {/* Education Section */}
        <Education />

        {/* Experience Section */}
        <Experience />

        {/* Projects Section */}
        <Projects />
      </div>
    </main>
  );
}
