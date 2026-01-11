'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { SkeletonCard } from '@/components/ui/skeleton';

export default function BlogsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-[800px] mx-auto p-6">
          <div className="pt-24 space-y-6">
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
        {/* Header Section */}
        <section className="pt-24 pb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Welcome to My Blogs</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Coming Soon...
          </p>
          
          {/* Coming Soon Card */}
          <div className="max-w-md mx-auto p-8 rounded-lg border bg-card">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Stay tuned</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Blog Content in Development</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              I&apos;m currently working on creating content about my learning journey. Check back soon.
            </p>
            
            <div className="flex items-center justify-center mt-6 gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Expected launch: Soon
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
