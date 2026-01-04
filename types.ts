
export type Grade = 
  | 'Elementary (K-5)'
  | 'Middle School (6-8)'
  | 'High School (9-12)'
  | 'College/University'
  | 'Postgraduate';

export type Subject = 
  | 'Mathematics'
  | 'Science'
  | 'History'
  | 'Literature/English'
  | 'Computer Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Geography'
  | 'Economics'
  | 'Philosophy'
  | 'Art History';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AppState {
  grade: Grade | null;
  subject: Subject | null;
  messages: ChatMessage[];
  isLoading: boolean;
}
