import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for ChatInput.
 */
interface ChatInputProps {
  /** Callback fired when the user sends a message. */
  onSend: (message: string) => void;
  /** Whether the input is disabled (e.g. while loading). */
  disabled: boolean;
}

/**
 * ChatInput Component.
 * A premium, styled input field with a glowing effect and animated send button.
 * Responsive for Mobile, Tablet, Desktop, and TV.
 */
export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount and when re-enabled
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      // slight delay to ensure render
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
      // Reset height if we were doing auto-expand, but for now fixed/scrolling is fine
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-expand logic simple
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="w-full flex justify-center px-4 pb-4 md:pb-6 2xl:pb-10">
      <div className="relative group w-full md:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl">

        {/* Input Container */}
        <div className="relative flex items-end bg-persona-bg border border-persona-text/10 rounded-2xl pl-4 pr-2 py-3 md:py-4 2xl:py-6 shadow-lg transition-all duration-300 focus-within:border-persona-text/30 focus-within:shadow-[0_0_15px_rgba(227,213,202,0.05)]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleChange}
            placeholder={disabled ? "Waiting for response..." : "Ask anything..."}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-base md:text-lg 2xl:text-xl text-persona-text placeholder:text-persona-text/20 font-serif italic disabled:opacity-50 min-w-0 tracking-wide pr-10 resize-none max-h-[150px] scrollbar-hide py-1 2xl:py-2"
          />

          <div className="absolute right-3 bottom-3 2xl:bottom-5 w-10 h-10 flex items-center justify-center">
            <AnimatePresence>
              {input.trim() && !disabled && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="p-2 md:p-2.5 2xl:p-3 rounded-xl text-persona-bg bg-persona-text shadow-sm hover:shadow-md transition-shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5 2xl:w-6 2xl:h-6">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
