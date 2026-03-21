export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  title: string;
  personaId: string;
  messages: Message[];
  createdAt: number;
  version: number; // For localStorage versioning
}

export interface ChatRequest {
  character: string;
  message: string;
  history: { role: MessageRole; content: string }[];
}
