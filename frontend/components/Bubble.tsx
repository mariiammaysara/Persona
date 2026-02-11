import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

/**
 * Props for the Bubble component.
 */
interface BubbleProps {
  /** The role of the sender ("ai" or "user"). */
  role: "ai" | "user";
  /** The text content of the message (Markdown supported). */
  text: string;
}

/**
 * Bubble Component.
 * Renders a single chat message with Markdown support and language-aware styling (RTL/LTR).
 * Uses Framer Motion for entrance animations.
 */
const Bubble = memo(function Bubble({ role, text }: BubbleProps) {
  const isAI = role === "ai";
  // Simple heuristic for Arabic text direction
  const isArabic = /[\u0600-\u06FF]/.test(text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`max-w-[90%] md:max-w-[85%] lg:max-w-[80%] 2xl:max-w-[75%] px-4 py-4 md:px-5 md:py-5 2xl:px-8 2xl:py-6 rounded-2xl shadow-sm border
      text-sm md:text-base 2xl:text-lg leading-relaxed 2xl:leading-loose overflow-hidden
      ${isAI
          ? "bg-transparent border-persona-text/20 text-persona-text self-start rounded-tl-sm"
          : "bg-persona-text border-transparent text-persona-bg self-end rounded-br-sm font-medium"
        } ${isArabic ? 'text-right font-arabic' : 'text-left font-sans'}`}
    >
      <div className={`markdown-content ${isAI ? 'prose-headings:text-persona-text prose-strong:text-persona-text' : ''}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-3 2xl:mb-4 last:mb-0">{children}</p>,
            h1: ({ children }) => <h1 className="text-lg md:text-xl 2xl:text-2xl font-serif mb-3 2xl:mb-4 font-medium">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base md:text-lg 2xl:text-xl font-serif mb-3 2xl:mb-4 font-medium">{children}</h2>,
            ul: ({ children }) => <ul className="list-disc ml-5 mb-3 2xl:mb-4 marker:text-persona-text/50 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 2xl:mb-4 marker:text-persona-text/50 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="pl-1">{children}</li>,
            code: ({ children }) => (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs md:text-sm 2xl:text-base font-mono tracking-tight text-current">
                {children}
              </code>
            ),
            pre: ({ children, ...props }) => {
              // Extract code content for copy functionality or just better rendering
              return (
                <div className="bg-[#111111] border border-[#2a2a2a] p-4 2xl:p-6 rounded-xl mb-3 2xl:mb-5 overflow-x-auto my-2 shadow-inner">
                  <pre {...props} className="font-mono text-sm md:text-base 2xl:text-lg leading-relaxed text-gray-300">
                    {children}
                  </pre>
                </div>
              );
            },
            strong: ({ children }) => <strong className="font-semibold text-current">{children}</strong>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-persona-text/30 pl-4 italic mb-3 opacity-80">{children}</blockquote>
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
});

export default Bubble;
