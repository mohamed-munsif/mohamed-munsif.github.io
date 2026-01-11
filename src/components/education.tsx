import { GraduationCap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Education() {
  return (
    <section className="mb-16 scroll-mt-32" id="education">
      <div className="mb-2">
        <h2 className="text-3xl font-bold">Education</h2>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* University Logo */}
          <div className="flex-shrink-0">
            <Avatar className="w-16 h-16">
              <AvatarImage 
                src="/education/South_Eastern_University_of_Sri_Lanka_logo.png" 
                alt="South Eastern University of Sri Lanka"
              />
              <AvatarFallback className="bg-primary/10">
                <GraduationCap className="w-8 h-8 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Education Details */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              South Eastern University of Sri Lanka
            </h3>
            <p className="text-lg text-primary font-medium mb-1">
              BSc. Eng. (Hons.) in Electrical and Electronics
            </p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm text-muted-foreground">
                2023 - 2027
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Undergraduate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
