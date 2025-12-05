export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ChatState = 'idle' | 'loading' | 'error';
