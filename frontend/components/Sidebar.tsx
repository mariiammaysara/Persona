'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '@/types/chat';
import PersonaMask from './PersonaMask';

/**
 * Props for the Sidebar component.
 */
interface SidebarProps {
    /** List of active chat sessions. */
    sessions?: Session[];
    /** The ID of the currently active session. */
    currentSessionId?: string | null;
    /** The ID of the currently active persona. */
    activePersona: string;
    /** Callback to create a new chat. */
    onNewChat?: () => void;
    /** Callback to select a session. */
    onSelectSession?: (id: string) => void;
    /** Callback to delete a session. */
    onDeleteSession?: (e: React.MouseEvent, id: string) => void;
}

/**
 * Labels for personas in the sidebar.
 */
const PERSONA_LABELS: Record<string, string> = {
  sherlock: "SHERLOCK",
  tony_stark: "TONY",
  yoda: "YODA",
  hermione: "HERMIONE",
  mittens: "MITTENS",
};

/**
 * Sidebar Component.
 * Collapsible sidebar handling session navigation, history management, and responsivity.
 * Enhanced with accessible toggle buttons for easier opening/closing.
 */
export default function Sidebar({ sessions = [], currentSessionId, activePersona, onNewChat, onSelectSession, onDeleteSession }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Initial check for mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024; // Increased threshold for tablet/mobile
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
        open: { 
            width: isMobile ? "280px" : "18rem", 
            x: 0, 
            opacity: 1
        },
        closed: { 
            width: isMobile ? "0px" : "4.5rem", 
            x: isMobile ? -280 : 0, 
            opacity: isMobile ? 0 : 1
        }
    };

    return (
        <>
            {/* Mobile Open Trigger (Floating Button) */}
            <AnimatePresence>
                {isMobile && !isOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(227, 213, 202, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed top-6 left-6 z-[60] p-3 rounded-full bg-persona-bg border border-persona-text/20 text-persona-text shadow-2xl backdrop-blur-md"
                        title="Open Sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.aside
                initial={isMobile ? { x: -280 } : false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                transition={isMobile ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`
                    h-full border-r border-persona-border/5 flex flex-col bg-persona-bg/95 backdrop-blur-sm overflow-visible z-40
                    ${isMobile ? 'fixed inset-y-0 left-0 shadow-2xl' : 'relative'}
                `}
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, { offset, velocity }) => {
                    if (isMobile && (offset.x < -100 || velocity.x < -100)) setIsOpen(false);
                }}
            >
                {/* Desktop/Tablet Toggle Handle (Interactive Edge) */}
                {!isMobile && (
                    <div
                        className="absolute -right-4 top-1/2 -translate-y-1/2 h-64 w-8 flex items-center justify-center group z-50 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        title={isOpen ? "Collapse Sidebar (Ctrl + B)" : "Expand Sidebar (Ctrl + B)"}
                    >
                        <div className={`
                            absolute h-20 w-1 bg-persona-text rounded-full transition-all duration-300 ease-out
                            ${isOpen ? 'opacity-5 group-hover:opacity-40' : 'opacity-20 group-hover:opacity-60'}
                        `}></div>
                        
                        {/* Interactive Chevron that appears on hover */}
                        <motion.div 
                            className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{ rotate: isOpen ? 0 : 180 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-persona-text">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </motion.div>
                    </div>
                )}

                {/* Sidebar Top Header with Logo */}
                <div className={`flex items-center transition-all duration-300 shrink-0 ${isOpen ? 'p-4 justify-between mt-2' : 'p-4 justify-center mt-2'}`}>
                    {isOpen ? (
                        <>
                            <div className="flex items-center gap-3 group cursor-default">
                                <PersonaMask 
                                    personaId={activePersona} 
                                    size={32} 
                                    className="opacity-90 transition-transform duration-500 group-hover:scale-110"
                                    strokeWidth={4}
                                    showDetails={false} 
                                />
                                <h1 className="font-serif italic text-xl tracking-widest text-persona-text opacity-90 select-none">Persona</h1>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-persona-text/10 rounded-full transition-colors hidden md:flex text-persona-text/40 hover:text-persona-text"
                                title="Close Sidebar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-1 group hover:bg-persona-text/10 rounded-xl transition-all duration-500 hover:scale-110"
                            title="Open Sidebar"
                        >
                            <PersonaMask 
                                personaId={activePersona} 
                                size={28} 
                                className="opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                                strokeWidth={6}
                                showDetails={false} 
                            />
                        </button>
                    )}
                </div>

                {/* New Chat Button */}
                <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 shrink-0 ${isOpen ? 'px-4 mb-4' : 'px-2 items-center mb-4'}`}>
                    <button
                        onClick={() => {
                            onNewChat?.();
                            if (isMobile) setIsOpen(false);
                        }}
                        className={`
                            flex items-center transition-all duration-300 group whitespace-nowrap border border-persona-border/20 text-persona-text hover:bg-persona-text/10
                            ${isOpen ? 'gap-3 px-4 py-3 rounded-lg w-full justify-start' : 'justify-center p-2.5 rounded-full w-10 h-10 border-transparent hover:border-persona-border/20'}
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
                </div>

                {/* Session List */}
                <div className={`flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1 ${isOpen ? 'px-3 pb-3' : 'px-1 items-center'}`}>
                    {isOpen && <h3 className="text-[10px] font-serif italic tracking-widest text-persona-text/50 mb-3 px-2 uppercase">recent</h3>}
                    <div className="flex flex-col gap-1">
                        {sessions.sort((a, b) => b.createdAt - a.createdAt).map((session) => {
                            const personaLabel = PERSONA_LABELS[session.personaId] ?? session.personaId.toUpperCase();
                            
                            return (
                                <div
                                    key={session.id}
                                    className={`
                                        group relative flex items-center cursor-pointer transition-all duration-200 rounded-md
                                        ${isOpen ? 'w-full px-3 py-3 gap-3' : 'justify-center w-10 h-10 rounded-full'}
                                        ${currentSessionId === session.id 
                                            ? 'bg-[#E3D5CA]/8 border-l-2 border-[#E3D5CA]/60' 
                                            : 'hover:bg-[#E3D5CA]/5 hover:border-l-2 hover:border-[#E3D5CA]/30 border-l-2 border-transparent'}
                                    `}
                                    onClick={() => {
                                        onSelectSession?.(session.id);
                                        if (isMobile) setIsOpen(false);
                                    }}
                                >
                                    {/* Persona Dot/Indicator */}
                                    <div className="shrink-0 w-2 h-2 rounded-full bg-[#E3D5CA]/60 group-hover:bg-[#E3D5CA]/90 transition-colors" />

                                    {isOpen && (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-xs font-medium truncate max-w-[150px] ${currentSessionId === session.id ? 'text-persona-text' : 'text-persona-text/70'}`}>
                                                        {session.title || 'Untitled'}
                                                    </p>
                                                    <span className="text-[9px] text-[#E3D5CA]/30 uppercase tracking-widest flex-shrink-0">
                                                        {personaLabel}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteSession?.(e, session.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded transition-all duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-200"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
