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
export default function Bubble({ role, text }: BubbleProps) {
  const isAI = role === "ai";
  const isArabic = /[\u0600-\u06FF]/.test(text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-md text-sm leading-[1.8] overflow-hidden
      ${isAI
          ? "bg-transparent border border-persona-text/30 text-persona-text self-start rounded-tl-sm"
          : "bg-persona-text text-persona-bg self-end rounded-br-sm font-medium"
        } ${isArabic ? 'text-right font-arabic' : 'text-left font-sans'}`}
    >
      <div className={`markdown-content ${isAI ? 'prose-headings:text-persona-text prose-strong:text-persona-text' : ''}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            h1: ({ children }) => <h1 className="text-lg font-serif mb-2 font-medium">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-serif mb-2 font-medium">{children}</h2>,
            ul: ({ children }) => <ul className="list-disc ml-5 mb-2 marker:text-persona-text/50 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-5 mb-2 marker:text-persona-text/50 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="pl-1">{children}</li>,
            code: ({ children }) => <code className="bg-[#E3D5CA]/10 px-1.5 py-0.5 rounded text-xs font-mono tracking-tight">{children}</code>,
            pre: ({ children }) => <div className="bg-[#E3D5CA]/5 p-3 rounded-lg mb-2 overflow-x-auto border border-persona-text/10">{children}</div>,
            strong: ({ children }) => <strong className="font-semibold text-current">{children}</strong>
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
