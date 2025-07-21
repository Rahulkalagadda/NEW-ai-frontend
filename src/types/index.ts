export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Connection {
  id: string;
  name: string;
  type: 'google-drive' | 'google-docs' | 'notion';
  connected: boolean;
  connectedAt?: Date;
}

export interface QueryLog {
  id: string;
  query: string;
  response: string;
  source: string;
  sourceType: 'google-drive' | 'google-docs' | 'notion';
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: string;
}