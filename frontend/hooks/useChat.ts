'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Message, Session, ChatRequest } from "@/types/chat";
import { streamChat } from "@/services/api";
import { STORAGE_KEY, STORAGE_VERSION, TOAST_DURATION_MS } from "@/constants/config";

export function useChat() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState<string>('sherlock');
  const [isStreaming, setIsStreaming] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const abortRef = useRef<AbortController | null>(null);

  // Derived State
  const currentSession = useMemo(() => 
    sessions.find(s => s.id === currentSessionId), 
  [sessions, currentSessionId]);

  const messages = useMemo(() => 
    currentSession?.messages || [], 
  [currentSession]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), TOAST_DURATION_MS);
  }, []);

  // Persistence: Load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.version === STORAGE_VERSION) {
            const valid = (parsed.sessions as Session[]).filter(s => s.messages.length > 0);
            if (valid.length > 0) {
              setSessions(valid);
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          console.error("Failed to load sessions", e);
        }
      }
    }
  }, []);

  // Persistence: Save
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const valid = sessions.filter(s => s.messages.length > 0);
      if (valid.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          version: STORAGE_VERSION,
          sessions: valid
        }));
      }
    }
  }, [sessions]);

  // Sync Persona
  useEffect(() => {
    if (currentSession?.personaId) {
      setActivePersona(currentSession.personaId);
    }
  }, [currentSessionId, currentSession?.personaId]);

  const createNewSession = useCallback((personaId: string): string => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      personaId,
      createdAt: Date.now(),
      version: STORAGE_VERSION
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // 1. Cancel in-flight
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    let targetId = currentSessionId;
    
    // 2. Ensure session exists
    if (!targetId) {
      targetId = createNewSession(activePersona);
    }

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content, 
      timestamp: Date.now() 
    };
    
    const aiPlaceholderId = (Date.now() + 1).toString();
    const aiPlaceholder: Message = { 
      id: aiPlaceholderId, 
      role: 'assistant', 
      content: '', 
      timestamp: Date.now() + 1 
    };

    // Optimistic Update
    setSessions(prev => prev.map(s => 
      s.id === targetId 
        ? { ...s, messages: [...s.messages, userMsg, aiPlaceholder], createdAt: Date.now() } 
        : s
    ));

    setIsStreaming(true);

    try {
      // Build History
      const currentMsgs = sessions.find(s => s.id === targetId)?.messages || [];
      const history = currentMsgs
        .filter(m => m.content.trim() !== '')
        .map(m => ({ role: m.role, content: m.content }))
        .slice(-10); // Keep last 10 messages for context

      const request: ChatRequest = {
        character: activePersona,
        message: content,
        history
      };

      let streamedText = "";
      await streamChat(request, (chunk) => {
        streamedText += chunk;
        setSessions(prev => prev.map(s => {
          if (s.id === targetId) {
            const msgs = [...s.messages];
            const idx = msgs.findIndex(m => m.id === aiPlaceholderId);
            if (idx !== -1) {
              msgs[idx] = { ...msgs[idx], content: streamedText };
            }
            return { ...s, messages: msgs };
          }
          return s;
        }));
      });

      // Final Update (Title etc)
      setSessions(prev => prev.map(s => {
        if (s.id === targetId) {
          const msgs = [...s.messages];
          const idx = msgs.findIndex(m => m.id === aiPlaceholderId);
          if (idx !== -1) {
            msgs[idx] = { ...msgs[idx], content: streamedText.trim() };
          }
          
          let title = s.title;
          if (s.messages.length <= 2) {
             const clean = content.replace(/^(Hi|Hello|Hey)\s*/i, '').trim();
             title = clean.split(' ').slice(0, 5).join(' ') || 'New Conversation';
          }
          
          return { ...s, messages: msgs, title };
        }
        return s;
      }));

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      
      console.error("[CHAT_STREAM_ERROR]", err);
      
      let message = "Unable to connect to Persona Core.";
      if (err.name === 'ApiError') {
        if (err.status === 404) message = "Persona not found.";
        else if (err.status >= 500) message = "Persona Core is currently overloaded. Please try again.";
      } else if (err.message?.includes('Failed to fetch')) {
        message = "Network error. Please check your connection.";
      }
      
      showToast(message);
      // Rollback
      setSessions(prev => prev.map(s => 
        s.id === targetId 
          ? { ...s, messages: s.messages.filter(m => m.id !== aiPlaceholderId) } 
          : s
      ));
    } finally {
      setIsStreaming(false);
    }
  }, [currentSessionId, activePersona, sessions, createNewSession, showToast]);

  const selectPersona = useCallback((id: string) => {
    setActivePersona(id);
    if (currentSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, personaId: id } : s
      ));
    }
  }, [currentSessionId]);

  const deleteSession = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
  }, [currentSessionId]);

  return {
    sessions: sessions.filter(s => s.messages.length > 0),
    currentSessionId,
    activePersona,
    messages,
    isStreaming,
    notification,
    sendMessage,
    selectPersona,
    deleteSession,
    selectSession: setCurrentSessionId,
    newChat: () => setCurrentSessionId(null)
  };
}
