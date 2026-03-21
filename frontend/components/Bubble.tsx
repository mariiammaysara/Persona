import { memo, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

import { MessageRole } from '@/types/chat';

/**
 * Props for the Bubble component.
 */
interface BubbleProps {
  /** The role of the sender. */
  role: MessageRole;
  /** The text content of the message (Markdown supported). */
  text: string;
}

/**
 * Bubble Component.
 * Minimalist, luxury chat bubbles.
 * Assistant: Text-only, no background.
 * User: Subtle frosted pill.
 */
const Bubble = memo(function Bubble({ role, text }: BubbleProps) {
  const isAI = role === "assistant";
  const [copied, setCopied] = useState(false);

  /**
   * Handle copying text to clipboard.
   */
  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6 w-full group relative`}
    >
      <div 
        className={`
          relative px-2 py-0.5 transition-all duration-300
          ${isAI
            ? "max-w-[85%] text-[#E3D5CA]/85 text-sm leading-7 text-left px-2"
            : "bg-[#E3D5CA]/10 border border-[#E3D5CA]/15 text-[#E3D5CA] rounded-2xl rounded-tr-sm px-5 py-3 max-w-[75%] text-sm leading-7 text-left shadow-sm"
          }
        `}
      >
        <div className={`markdown-content ${isAI ? 'prose-headings:text-persona-text/90 prose-strong:text-persona-text/90' : 'prose-headings:text-persona-text prose-strong:text-persona-text'}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-base md:text-lg font-serif mb-3 font-medium opacity-90">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm md:text-base font-serif mb-3 font-medium opacity-90">{children}</h2>,
              ul: ({ children }) => <ul className="list-disc ml-4 mb-4 marker:text-persona-text/30 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 mb-4 marker:text-persona-text/30 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="pl-1">{children}</li>,
              code: ({ children }) => (
                <code className="bg-white/5 px-1.5 py-0.5 rounded text-[11px] md:text-xs font-mono tracking-tight text-[#E3D5CA]/70">
                  {children}
                </code>
              ),
              pre: ({ children, ...props }) => {
                return (
                  <div className="bg-black/20 border border-white/5 p-4 rounded-xl mb-4 overflow-x-auto my-3 shadow-inner">
                    <pre {...props} className="font-mono text-xs md:text-sm leading-relaxed text-[#E3D5CA]/60">
                      {children}
                    </pre>
                  </div>
                );
              },
              strong: ({ children }) => <strong className="font-semibold text-current">{children}</strong>,
              blockquote: ({ children }) => <blockquote className="border-l border-[#E3D5CA]/20 pl-4 italic mb-4 opacity-70">{children}</blockquote>
            }}
          >
            {text}
          </ReactMarkdown>
        </div>

        {/* Copy Button - Floating subtle icon */}
        <button
          onClick={handleCopy}
          className={`
            absolute top-0 ${isAI ? '-right-8' : '-left-8'} 
            p-1.5 rounded-full transition-all duration-300
            opacity-0 group-hover:opacity-100
            text-[#E3D5CA]/20 hover:text-[#E3D5CA]/60 hover:bg-white/5
          `}
          title="Copy"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Check size={12} />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Copy size={12} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
});

export default Bubble;
