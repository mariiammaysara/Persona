"use client";

import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import Sidebar from "@/components/Sidebar";
import PersonaSelector from "@/components/PersonaSelector";
import ChatInput from "@/components/ChatInput";
import ChatArea from "@/components/ChatArea";
import Splash from "@/components/Splash";
import ErrorBoundary from "@/components/ErrorBoundary";
import { personas } from "@/lib/personaConfig";

export default function Page() {
  const {
    sessions,
    currentSessionId,
    activePersona,
    messages,
    isStreaming,
    notification,
    sendMessage,
    selectPersona,
    deleteSession,
    selectSession,
    newChat,
  } = useChat();

  /**
   * Helper to get a clean display name for the persona.
   */
  const getPersonaName = (id: string): string => {
    // @ts-ignore - indexing lib/personas with technical ID string
    return personas[id]?.label || id.charAt(0).toUpperCase() + id.slice(1).replace('_', ' ');
  };

  return (
    <main className="flex h-[100dvh] w-full bg-persona-bg overflow-hidden text-persona-text font-sans relative">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        activePersona={activePersona}
        onNewChat={newChat}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 relative w-full h-full overflow-hidden"
      >
        {notification && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-2 bg-[#1a0f0f] backdrop-blur-md border border-red-900/30 text-red-200/80 text-[10px] uppercase tracking-[0.2em] rounded-full shadow-2xl transition-all animate-pulse">
            {notification}
          </div>
        )}

        {/* GitHub Repository Link */}
        <motion.a
          href="https://github.com/mariiammaysara/Persona"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="absolute top-6 right-6 z-50 p-2 text-persona-text/20 hover:text-persona-text transition-all duration-500 hover:drop-shadow-[0_0_12px_rgba(227,213,202,0.6)] cursor-pointer group"
          title="View Source on GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-110"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </motion.a>

        {/* Top Header - Compact Persona Selector restored to top center */}
        <div className="absolute top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <PersonaSelector
            selectedPersona={activePersona}
            onSelect={selectPersona}
          />
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full h-full relative">
          <ErrorBoundary>
            {/* Background Splash - Only visible when no messages */}
            {messages.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Splash 
                  personaId={activePersona} 
                  personaName={getPersonaName(activePersona)} 
                />
              </div>
            )}

            {/* Chat Area - Updated padding for raised input */}
            {messages.length > 0 && (
              <div className="w-full h-full flex flex-col pb-[150px]">
                <ChatArea 
                  messages={messages} 
                  isLoading={isStreaming} 
                  personaId={activePersona}
                  personaName={getPersonaName(activePersona)}
                />
              </div>
            )}

            {/* Repositioned Input Area - Pinned to bottom, raised slightly more */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-8 pt-2">
              {/* Fade gradient above input in chat state */}
              {messages.length > 0 && (
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-t from-[#0A0908] to-transparent pointer-events-none -translate-y-full" />
              )}
              
              <motion.div 
                initial={messages.length === 0 ? { opacity: 0, y: 10 } : false}
                animate={messages.length === 0 ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="max-w-4xl mx-auto w-full flex flex-col items-center px-2"
              >
                <ChatInput onSend={sendMessage} disabled={isStreaming} />
              </motion.div>
            </div>
          </ErrorBoundary>
        </div>
      </motion.div>
    </main>
  );
}
