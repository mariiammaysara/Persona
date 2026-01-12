import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for ChatInput.
 */
interface ChatInputProps {
  /** Callback fired when the user sends a message. */
  onSend?: (message: string) => void;
  /** Whether the input is disabled (e.g. while loading). */
  disabled?: boolean;
}

/**
 * ChatInput Component.
 * A premium, styled input field with a glowing effect and animated send button.
 */
export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  /**
   * Handles the send action with a small artificial delay for UX.
   */
  const handleSend = async () => {
    if (input.trim() && onSend && !disabled) {
      setIsSending(true);
      // Wait for animation frame to feel premium
      await new Promise(resolve => setTimeout(resolve, 150));
      onSend(input);
      setInput('');
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center px-4 pb-12">
      <div className="relative group w-full md:max-w-4xl">
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-persona-text/20 blur-md rounded-full transition duration-500 opacity-20 group-hover:opacity-40"></div>

        {/* Input Container */}
        <div className="relative flex items-center bg-persona-bg border-[0.5px] border-persona-text/20 rounded-full pl-8 pr-2 py-4 shadow-2xl transition-all duration-500 group-hover:border-persona-text/30 focus-within:border-persona-text/40 focus-within:shadow-[0_0_20px_rgba(227,213,202,0.1)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Waiting for response..." : "Ask anything..."}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-base text-persona-text placeholder:text-persona-text/20 font-serif italic disabled:opacity-50 min-w-0 tracking-wide pr-10"
            onKeyDown={handleKeyDown}
          />

          <div className="absolute right-3 w-10 h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {input.trim() && !isSending && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleSend}
                  disabled={disabled}
                  className="p-2.5 rounded-full text-persona-bg bg-persona-text shadow-glow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
