import { useEffect, useRef } from 'react';
import Bubble from "./Bubble";

/**
 * Represents a chat message.
 */
interface Message {
  role: 'user' | 'ai';
  content: string;
}

/**
 * Props for ChatArea.
 */
interface ChatAreaProps {
  /** List of messages to display. */
  messages: Message[];
  /** Whether a message is currently loading (optional, used for scroll trigger). */
  isLoading?: boolean;
}

/**
 * ChatArea Component.
 * Displays the scrollable list of chat messages and handles auto-scrolling.
 * Renders a "Pulse" typing indicator if the last AI message is empty.
 */
export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when messages change.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <section className="flex-1 overflow-y-auto px-4 py-3 md:pt-6 flex flex-col gap-3 scrollbar-hide">
      <div className="flex-1 flex flex-col justify-end gap-6 2xl:gap-8 w-full md:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto pb-8 2xl:pb-12">
        {messages.map((msg, index) => {
          // Render pulse indicator for empty AI message (Typing state)
          if (msg.role === 'ai' && !msg.content) {
            return (
              <div key={index} className="self-start px-5 py-5 2xl:px-6 2xl:py-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 bg-persona-text/40 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 bg-persona-text/40 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 bg-persona-text/40 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )
          }
          return (
            <Bubble
              key={index}
              role={msg.role}
              text={msg.content}
            />
          );
        })}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}
