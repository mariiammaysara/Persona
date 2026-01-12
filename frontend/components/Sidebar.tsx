import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '@/app/page';

/**
 * Props for the Sidebar component.
 */
interface SidebarProps {
    /** List of active chat sessions. */
    sessions?: Session[];
    /** The ID of the currently active session. */
    currentSessionId?: string | null;
    /** Callback to create a new chat. */
    onNewChat?: () => void;
    /** Callback to select a session. */
    onSelectSession?: (id: string) => void;
    /** Callback to delete a session. */
    onDeleteSession?: (e: React.MouseEvent, id: string) => void;
}

/**
 * Sidebar Component.
 * Collapsible sidebar handling session navigation, history management, and responsivity.
 */
export default function Sidebar({ sessions = [], currentSessionId, onNewChat, onSelectSession, onDeleteSession }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Initial check for mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false); // Default to closed on mobile
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Keyboard Shortcut (Ctrl+B)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const sidebarVariants = {
        open: { width: isMobile ? "100%" : "18rem", x: 0, opacity: 1 },
        closed: { width: isMobile ? "0rem" : "4rem", x: isMobile ? "-100%" : 0, opacity: isMobile ? 0 : 1 }
    };

    return (
        <>
            {/* Mobile Swipe-to-Open Zone (Left Edge) */}
            {isMobile && !isOpen && (
                <motion.div
                    className="fixed inset-y-0 left-0 w-8 z-50 bg-transparent"
                    onPanEnd={(e, info) => {
                        if (info.offset.x > 50) setIsOpen(true);
                    }}
                />
            )}

            {/* Mobile Hamburger (Visible only when closed on mobile) */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2 text-persona-text bg-persona-bg/80 backdrop-blur-md rounded-full shadow-glow border border-persona-border/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            )}

            <motion.aside
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`
                    h-full border-r border-persona-border/5 flex flex-col bg-persona-bg/95 backdrop-blur-sm overflow-visible z-40
                    ${isMobile ? 'fixed inset-y-0 left-0 shadow-2xl' : 'relative'}
                `}
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                    if (isMobile && (offset.x < -100 || velocity.x < -100)) setIsOpen(false);
                }}
            >
                {/* Desktop Toggle Handle (Hidden on Mobile) */}
                {!isMobile && (
                    <div
                        className="absolute -right-4 top-1/2 -translate-y-1/2 h-64 w-8 flex items-center justify-center group z-50 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        title="Toggle Sidebar (Ctrl + B)"
                    >
                        <div className={`
                            absolute h-16 w-0.5 bg-persona-text rounded-full transition-all duration-300 ease-out
                            opacity-20 group-hover:opacity-100 group-hover:h-20 group-hover:shadow-[0_0_8px_rgba(227,213,202,0.6)]
                        `}></div>
                        <div className="absolute bg-persona-bg border border-persona-border/20 rounded-full p-1 text-persona-text transition-all duration-300 transform scale-0 group-hover:scale-100 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </div>
                    </div>
                )}

                {/* Header / New Chat */}
                <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 shrink-0 ${isOpen ? 'p-4' : 'p-2 items-center'}`}>
                    <button
                        onClick={() => {
                            onNewChat?.();
                            if (isMobile) setIsOpen(false);
                        }}
                        className={`
                            flex items-center transition-all duration-300 group whitespace-nowrap border border-persona-border/20 text-persona-text hover:bg-persona-text/10
                            ${isOpen ? 'gap-3 px-4 py-3 rounded-lg w-full justify-start' : 'justify-center p-2 rounded-full w-10 h-10 border-transparent hover:border-persona-border/20'}
                        `}
                        title="New Chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span className={`font-serif italic tracking-wider text-sm transition-all duration-300 overflow-hidden ${isOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0 ml-0'}`}>
                            New Chat
                        </span>
                    </button>
                    {isOpen && <div className="h-px bg-persona-border/10 w-full" />}
                </div>

                {/* Session List */}
                <div className={`flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1 ${isOpen ? 'px-3 pb-3' : 'px-1 items-center'}`}>
                    {isOpen && <h3 className="text-[11px] font-serif italic tracking-widest text-persona-text/50 mb-3 px-2">recent</h3>}
                    <AnimatePresence>
                        {sessions.sort((a, b) => b.timestamp - a.timestamp).map((session) => (
                            <motion.div
                                key={session.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                                className={`
                                    group relative flex items-center cursor-pointer transition-colors duration-200 rounded-md
                                    ${isOpen ? 'w-full px-3 py-3 gap-3 hover:bg-persona-text/5' : 'justify-center w-10 h-10 hover:bg-persona-text/10 rounded-full'}
                                    ${currentSessionId === session.id ? 'bg-persona-text/10' : ''}
                                `}
                                onClick={() => {
                                    onSelectSession?.(session.id);
                                    if (isMobile) setIsOpen(false);
                                }}
                            >
                                {/* Icon based on Persona */}
                                <div className="shrink-0 w-2 h-2 rounded-full bg-persona-text/60 group-hover:bg-persona-text/90 transition-colors" />

                                {isOpen && (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${currentSessionId === session.id ? 'text-persona-text' : 'text-persona-text/70'}`}>
                                                {session.title || 'Untitled Conversation'}
                                            </p>
                                            <p className="text-[9px] text-persona-text/40 truncate mt-0.5">
                                                {new Date(session.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Delete Button (Visible on Hover) */}
                                        <button
                                            onClick={(e) => onDeleteSession?.(e, session.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded transition-all duration-200"
                                            title="Delete Chat"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.aside>

            {/* Mobile Backdrop */}
            {isMobile && isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                />
            )}
        </>
    );
}
