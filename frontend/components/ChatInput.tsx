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
 * Redesigned with a premium, block-style layout.
 * Features a dynamic send button and a subtle plus/attach icon.
 */
export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [hasText, setHasText] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount and when re-enabled
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
      setHasText(false);
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
    const val = e.target.value;
    setInput(val);
    setHasText(val.trim().length > 0);
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="relative group w-full max-w-4xl">
        <div className="
          w-full
          bg-[#1a1a1a]
          border border-[#E3D5CA]/10
          rounded-2xl
          px-4 py-3
          flex flex-col gap-2
          transition-all duration-300
          focus-within:border-[#E3D5CA]/20
          shadow-lg
        ">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            placeholder={disabled ? "Waiting..." : "Ask anything..."}
            rows={1}
            value={input}
            onChange={handleChange}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className="
              w-full bg-transparent resize-none
              text-[#E3D5CA] text-sm md:text-base leading-6
              placeholder:text-[#E3D5CA]/25
              focus:outline-none
              min-h-[24px] max-h-[200px]
              overflow-y-auto scrollbar-none
              tracking-wide
            "
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 200) + "px";
            }}
          />

          {/* Bottom row - Right aligned send only */}
          <div className="flex items-center justify-end">
            {/* Right — send button, only visible when text exists */}
            <AnimatePresence>
              {hasText && !disabled && (
                <motion.button
                  key="send-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="
                    w-7 h-7 rounded-full
                    bg-[#E3D5CA]/90
                    flex items-center justify-center
                    text-[#0A0908] text-xs
                    hover:bg-[#E3D5CA]
                    transition-all duration-200
                  "
                >
                  ↑
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
