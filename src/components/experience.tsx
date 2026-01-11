'use client';

import { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Experience() {
  const experiences = [
    {
      company: 'ZTE Lanka (Pvt) Ltd',
      logo: '/experience/zte_logo.jpg',
      position: 'Solar PV Design & Telecom Engineering',
      duration: 'Aug 2025 - Nov 2025',
      type: 'Internship',
      description: '',
      sections: [
        {
          title: '☀️ Solar PV Systems',
          responsibilities: [
            'Designed and developed solar PV systems ranging from kW to MW scale.',
            'Performed SLD drafting, DC and AC wire calculation, DC/AC optimization, and protection design for PV systems.',
            'Utilized AutoCAD and Google Earth Pro for layout design and PVSyst for performance analysis.',
            'Contributed to projects involving BESS (Battery Energy Storage System) integration and wiring path design.',
            'Participated in on-site inspections for system evaluation and verification.',
          ],
        },
        {
          title: '📡 Telecommunication Systems',
          responsibilities: [
            'Gained practical experience in LTE, 5G, and data center operations.',
            'Visited the Hutch Walpola Data Center to gain practical exposure to data center infrastructure, technologies and core network side.',
            'Worked with ZTE\'s UME platform for alarm monitoring, power system supervision, and antenna network management.',
            'Studied VPLS mesh topology, UPE–VPLS–SPE data flow, and IP routing for optimized network operation.',
          ],
        },
      ],
      skills: ['AutoCAD', 'PVSyst', 'Google Earth Pro', 'BESS', 'SLD Design', 'DC/AC Optimization', 'LTE', '5G', 'Data Center', 'ZTE UME', 'VPLS', 'IP Routing'],
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="mb-16 scroll-mt-32" id="experience">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center">Experience</h2>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          
          return (
            <div key={index} className="p-6 border rounded-lg">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={exp.logo} 
                      alt={exp.company}
                    />
                    <AvatarFallback className="bg-primary/10">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Experience Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {exp.position}
                  </h3>
                  <p className="text-base text-primary font-medium mb-1">
                    {exp.company}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm text-muted-foreground">
                      {exp.duration}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {exp.type}
                    </span>
                  </div>
                  
                  {/* Description */}
                  {exp.description && (
                    <p className="text-muted-foreground mb-3">
                      {exp.description}
                    </p>
                  )}

                  {/* Collapsed view - Show only first section title or summary */}
                  {!isExpanded && exp.sections && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">
                        Worked on: {exp.sections.map(s => s.title).join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Expanded view - Show all sections */}
                  {isExpanded && exp.sections && (
                    <div className="space-y-4 mb-4">
                      {exp.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <h4 className="text-base font-semibold text-foreground mb-2">
                            {section.title}
                          </h4>
                          <ul className="space-y-2">
                            {section.responsibilities.map((resp, respIndex) => (
                              <li key={respIndex} className="text-sm text-muted-foreground flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collapsed view - Show limited skills */}
                  {!isExpanded && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.skills.slice(0, 4).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {exp.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{exp.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Expanded view - Show all skills */}
                  {isExpanded && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* See more / Show less button */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {isExpanded ? (
                      <>
                        Show less
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        See more
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
