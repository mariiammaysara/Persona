'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for the Splash component.
 */
interface SplashProps {
    /** The display name of the active persona. */
    personaName: string;
}

/**
 * Splash Component.
 * The hero section displayed when the chat is empty.
 * Features a cinematic "Persona" title with breathing animation.
 */
export default function Splash({ personaName }: SplashProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full pointer-events-none select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={personaName}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    className="flex flex-col items-center"
                >
                    {/* Breathing Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            filter: [
                                "drop-shadow(0 0 10px rgba(227,213,202,0.1))",
                                "drop-shadow(0 0 15px rgba(227,213,202,0.2))",
                                "drop-shadow(0 0 10px rgba(227,213,202,0.1))"
                            ]
                        }}
                        transition={{
                            opacity: { duration: 1, ease: "easeOut" },
                            scale: { duration: 1, ease: "easeOut" },
                            y: { duration: 1, ease: "easeOut" },
                            filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="font-serif italic font-light text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-[#E3D5CA] to-[#E3D5CA]/60 tracking-[0.02em] pb-2"
                    >
                        Persona
                    </motion.h1>

                    {/* Subtitle with Letter Spacing Animation */}
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="mt-6 text-persona-text/40 font-sans font-light text-[9px] uppercase tracking-[0.5em]"
                    >
                        {personaName}
                    </motion.p>


                </motion.div>
            </AnimatePresence>
        </div>
    );
}
