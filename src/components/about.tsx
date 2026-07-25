import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function About() {
  return (
    <section id="about" className="pt-24 scroll-mt-32">
      {/* Header with photo and name */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="-mt-6">
          <Avatar className="w-30 h-30">
            <AvatarImage 
              src="/profile.png" 
              alt="Munsif Mashoor Profile"
            />
            <AvatarFallback className="bg-primary/10 text-2xl">
              <User className="w-12 h-12 text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Munsif Mashoor
          </h1>
        </div>
      </div>
      
      {/* Bio paragraph below photo */}
      <p className="text-lg mb-2 text-justify">
        On a mission to master AI/ML, one day at a time.
      </p>

      {/* Social Links */}
      <TooltipProvider>
        <div className="flex gap-4 mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/mohamed-munsif" aria-label="GitHub Profile">
                  <FaGithub className="h-6 w-6" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub Profile</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.linkedin.com/in/munsif-mohamed" aria-label="LinkedIn Profile">
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>LinkedIn Profile</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:munsif.mmm.2002@gmail.com" aria-label="Email Contact">
                  <MdEmail className="h-6 w-6" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send Email</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </section>
  );
}