import { createContext, useContext, useState, ReactNode } from 'react';

interface StudyDetailsContextType {
  selectedDate: string | null;
  setSelectedDate: (dateStr: string | null) => void;
}

const StudyDetailsContext = createContext<StudyDetailsContextType | undefined>(undefined);

export function StudyDetailsProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <StudyDetailsContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </StudyDetailsContext.Provider>
  );
}

export function useStudyDetails() {
  const context = useContext(StudyDetailsContext);
  if (context === undefined) {
    throw new Error('useStudyDetails must be used within a StudyDetailsProvider');
  }
  return context;
}
