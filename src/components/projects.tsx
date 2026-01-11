'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

// Define project type for better type safety
type Project = {
  title: string;
  description: string;
  image: string;
  github: string;
  demo?: string;
  tags: string[];
};

// Extract projects data for better maintainability
const projects: Project[] = [
  {
    title: "Speech Signal Modulation & Demodulation",
    description: "Advanced telecommunication system implementing amplitude modulation with quadrature components. Processes three audio files using Python, demonstrating complete signal modulation, transmission simulation, and recovery techniques with various carrier configurations.",
    image: "/project/signal_modulation.png",
    github: "https://github.com/mohamed-munsif/speech-signal-modulation",
    tags: ["Python", "Signal Processing", "NumPy", "SciPy", "Jupyter", "Audio Processing"]
  },
  {
    title: "Arduino Morse & Tap Code Communicator",
    description: "Versatile dual-mode communication system supporting both Morse code and Tap code encoding/decoding. Features LCD display, audio feedback, and interactive controls. Perfect for educational purposes and understanding historical communication methods.",
    image: "/project/morse_tap.png",
    github: "https://github.com/mohamed-munsif/arduino-morse-tap-communicator",
    demo: "https://www.tinkercad.com/things/8HkiRkxXjXT-morse-and-tap-v1?sharecode=vsdd2gJJ9Uky0NXtI056EeGX9bPACdNzHFJiHvPIP_Q",
    tags: ["Arduino", "C++", "Electronics", "Communication", "Hardware", "LCD"]
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-12 scroll-mt-32">
      <h3 className="text-3xl font-bold mb-8 text-center">Projects</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Project image */}
            <div className="relative h-52 w-full overflow-hidden">
              <Image 
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading={index < 2 ? "eager" : "lazy"}
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="flex-1 hover:bg-secondary transition-colors"
                >
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>
                    <FaGithub className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                
                {project.demo ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="flex-1 hover:bg-secondary"
                  >
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} demo`}>
                      <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled
                    className="flex-1 opacity-50 cursor-not-allowed"
                  >
                    <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
