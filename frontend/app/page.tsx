/**
 * @file Page.tsx
 * @description Main application page for Persona AI.
 * Handles the core chat logic, session management, and UI orchestration.
 * Integrates SideBar, ChatArea, and PersonaSelector components.
 * 
 * @author Mariam Maysara
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import PersonaSelector from "@/components/PersonaSelector";
import ChatInput from "@/components/ChatInput";
import ChatArea from "@/components/ChatArea";
import Splash from "@/components/Splash";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Represents a single message in the chat history.
 */
interface Message {
  role: 'user' | 'ai';
  content: string;
}

/**
 * Represents a chat session with metadata and message history.
 */
export interface Session {
  id: string;
  title: string;
  messages: Message[];
  persona: string;
  timestamp: number;
}

/**
 * Main Page Component.
 * Manages the global state of the application including sessions,
 * active persona, and chat interactions.
 */
export default function Page() {
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Derived State
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];
  const selectedPersona = currentSession?.persona || 'Sherlock Holmes';

  // Load Sessions from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem('persona_sessions');
      if (savedSessions) {
        try {
          const parsed: Session[] = JSON.parse(savedSessions);
          // Filter out any ghost sessions just in case
          const validSessions = parsed.filter(s => s.messages.length > 0);

          if (validSessions.length > 0) {
            setSessions(validSessions);
            // Set most recent as current by timestamp
            const mostRecent = [...validSessions].sort((a, b) => b.timestamp - a.timestamp)[0];
            setCurrentSessionId(mostRecent.id);
          } else {
            createNewSession();
          }
        } catch (e) {
          console.error("Failed to parse sessions from local storage", e);
          createNewSession();
        }
      } else {
        createNewSession();
      }
    }
  }, []);

  // Save Sessions to LocalStorage (Persist ONLY non-empty sessions)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const validSessions = sessions.filter(s => s.messages.length > 0);
      if (validSessions.length > 0) {
        localStorage.setItem('persona_sessions', JSON.stringify(validSessions));
      }
    }
  }, [sessions]);


  /**
   * Creates a new empty chat session and sets it as active.
   * If the current session is already empty, it prevents duplication.
   */
  const createNewSession = () => {
    // Prevent duplicate empty sessions (Smart Check)
    const current = sessions.find(s => s.id === currentSessionId);
    if (current && current.messages.length === 0) {
      showToast("You're already starting a new conversation.");
      return;
    }

    const newSession: Session = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      persona: 'Sherlock Holmes', // Default
      timestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  /**
   * Displays a temporary notification toast to the user.
   * @param msg - The message to display.
   */
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNewChat = () => {
    createNewSession();
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
      if (updated.length === 0) createNewSession();
    }
  };

  const handlePersonaSelect = (id: string) => {
    if (!currentSessionId) return;
    setSessions(prev => prev.map(s =>
      s.id === currentSessionId ? { ...s, persona: id } : s
    ));
  };

  /**
   * Helper to format persona names for display (e.g. "Sleepy Cat" -> "Mittens").
   * @param id - The persona ID.
   * @returns The display name.
   */
  const getPersonaName = (id: string) => {
    if (id === 'Sleepy Cat') return 'Mittens';
    return id.split(' ')[0];
  };

  /**
   * Cleans up the AI response text by removing prefixes or system artifacts.
   * @param text - The raw AI text.
   * @returns Cleaned text.
   */
  const formatResponse = (text: string) => {
    return text.replace(/^AI:\s*|^System:\s*/i, '').trim();
  };

  /**
   * Handles sending a user message to the backend.
   * Updates state optimistically, streams the response, and handles errors.
   * @param text - The user's input text.
   */
  const handleSendMessage = async (text: string) => {
    if (!currentSessionId) return;

    // 1. Optimistic Update (User)
    const userMsg: Message = { role: 'user', content: text };

    // 2. Prepare Placeholder for AI Response
    const aiPlaceholder: Message = { role: 'ai', content: '' };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, userMsg, aiPlaceholder], timestamp: Date.now() };
      }
      return s;
    }));

    setIsLoading(true);

    try {
      // Prepare History Logic (Context Window of last 5 turns)
      const history = [];
      let turnsFound = 0;
      // Iterate backwards to find last turns
      for (let i = messages.length - 1; i >= 0; i--) {
        // This logic relies on 'messages' from closure, which is the state BEFORE optimistic update.
        // That is actually correct because we don't want to double-send the new User message in history,
        // we send it in 'message' field.
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'ai') {
          history.unshift({
            user: messages[i].content,
            assistant: messages[i + 1].content
          });
          turnsFound++;
          if (turnsFound >= 5) break;
        }
      }

      // Resolve Backend URL
      let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!baseUrl) {
        if (process.env.NODE_ENV === 'production') {
          console.error("🚨 CRITICAL: NEXT_PUBLIC_BACKEND_URL is missing in production environment.");
          throw new Error("Backend URL is not configured.");
        } else {
          console.warn("⚠️ NEXT_PUBLIC_BACKEND_URL not found, defaulting to localhost:8000 for development.");
          baseUrl = 'http://localhost:8000';
        }
      }

      // Normalize URL (remove trailing slashes) to prevent double slashes (e.g. .../chat)
      const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

      const response = await fetch(`${cleanBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: selectedPersona,
          message: text,
          history: history
        })
      });

      if (!response.ok) throw new Error('API Error');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      // Stream Reading Loop
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        aiContent += chunk;

        // Streaming State Update
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            const updatedMsgs = [...s.messages];
            const lastIdx = updatedMsgs.length - 1;
            // Ensure we are updating the AI placeholder
            if (lastIdx >= 0 && updatedMsgs[lastIdx].role === 'ai') {
              updatedMsgs[lastIdx] = { ...updatedMsgs[lastIdx], content: aiContent };
            }
            return { ...s, messages: updatedMsgs };
          }
          return s;
        }));
      }

      // Final Polish & Save (Auto-Title Logic)
      const cleanContent = formatResponse(aiContent);
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const updatedMsgs = [...s.messages];
          const lastIdx = updatedMsgs.length - 1;
          if (lastIdx >= 0) {
            updatedMsgs[lastIdx] = { ...updatedMsgs[lastIdx], content: cleanContent };
          }

          let title = s.title;
          // Auto-Title Logic (Check if this is the first exchange: 2 messages total)
          if (s.messages.length <= 2) {
            const cleanText = text.replace(/^(Hi|Hello|Hey|Greetings)\s*/i, '').trim();
            const words = cleanText.split(' ').slice(0, 5).join(' ');
            title = words.length > 0 ? words : 'New Conversation';
          }

          return { ...s, messages: updatedMsgs, title, timestamp: Date.now() };
        }
        return s;
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      showToast("Unable to connect to Persona Core.");
      // Rollback: Remove the placeholder if failed
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const msgs = s.messages.filter(m => m.content !== '' || m.role !== 'ai');
          return { ...s, messages: msgs };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-[100dvh] w-full bg-persona-bg overflow-hidden text-persona-text font-sans">
      <Sidebar
        sessions={sessions.filter(s => s.messages.length > 0)}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {notification && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-[#1a0f0f] backdrop-blur-md border border-red-900/30 text-red-200/80 text-[10px] uppercase tracking-[0.2em] rounded-full shadow-2xl transition-all animate-pulse">
            {notification}
          </div>
        )}

        <div className="w-full flex justify-center pt-2 pb-4 z-10">
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelect={handlePersonaSelect}
          />
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <ErrorBoundary>
            {messages.length > 0 ? (
              <ChatArea messages={messages} isLoading={isLoading} />
            ) : (
              <Splash personaName={getPersonaName(selectedPersona)} />
            )}
          </ErrorBoundary>
        </div>

        <div className="relative w-full z-20 bg-gradient-to-t from-persona-bg via-persona-bg to-transparent pt-4">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />

          <div className="absolute bottom-4 w-full flex justify-center pointer-events-none">
            <a
              href="https://www.linkedin.com/in/mariam-maysara/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group text-[8px] md:text-[9px] text-persona-text/20 font-sans tracking-[0.3em] transition-all duration-700 ease-out hover:text-persona-text hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(227,213,202,0.8)] cursor-pointer pointer-events-auto select-none backdrop-blur-[1px]"
            >
              Designed & Developed by Mariam Maysara
              <span className="absolute -bottom-1 left-1/2 w-0 h-[0.5px] bg-persona-text group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out"></span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
