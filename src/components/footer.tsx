'use client';

export function Footer() {
  return (
    <footer className="border-t py-4 bg-background">
        <div className="flex justify-center items-center py-2">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mohamed Munsif. All rights reserved.
          </p>
        </div>
    </footer>
  );
}
