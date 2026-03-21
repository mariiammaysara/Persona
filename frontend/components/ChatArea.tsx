'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import Bubble from "./Bubble";
import TypingIndicator from "./TypingIndicator";
import PersonaMask from './PersonaMask';
import { personas } from '@/lib/personaConfig';

/**
 * Props for ChatArea.
 */
interface ChatAreaProps {
  /** List of messages to display. */
  messages: Message[];
  /** Whether a message is currently loading (optional, used for scroll trigger). */
  isLoading?: boolean;
  /** The technical ID of the active persona. */
  personaId: string;
  /** The display name of the active persona. */
  personaName: string;
}

/**
 * ChatArea Component.
 * Displays the scrollable list of chat messages and handles auto-scrolling.
 * Updated with a sticky persona header for better visibility.
 */
export default function ChatArea({ messages, isLoading, personaId, personaName }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when messages change or loading state flips.
   */
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === 'user';

  return (
    <section 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-4 pt-28 pb-8 md:pt-36 flex flex-col scrollbar-hide relative"
    >
      {/* Centered Max-Width Container for Message List Alignment */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto px-6 md:px-10 pb-8">
        {messages.map((msg) => (
          <Bubble
            key={msg.id}
            role={msg.role}
            text={msg.content}
          />
        ))}

        {isLoading && lastMessageIsUser && (
          <div className="self-start w-full">
             <div className="max-w-4xl mx-auto px-6 md:px-10">
                <TypingIndicator />
             </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </section>
  );
}
