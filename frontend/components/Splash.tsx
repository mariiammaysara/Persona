import { motion, AnimatePresence } from 'framer-motion';
import PersonaMask from './PersonaMask';

/**
 * Props for the Splash component.
 */
interface SplashProps {
    /** The technical ID of the active persona. */
    personaId: string;
    /** The display name of the active persona. */
    personaName: string;
}

/**
 * Splash Component.
 * The hero section displayed when the chat is empty.
 * Features a dynamic "Mask" logo that evolves based on the active persona.
 */
export default function Splash({ personaId, personaName }: SplashProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full pointer-events-none select-none">
            <AnimatePresence>
                <motion.div
                    key={personaId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    transition={{ duration: 1.2 }}
                    className="flex flex-col items-center"
                >
                    {/* Dynamic Persona Mask Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            filter: [
                                "drop-shadow(0 0 10px rgba(227,213,202,0.05))",
                                "drop-shadow(0 0 25px rgba(227,213,202,0.2))",
                                "drop-shadow(0 0 10px rgba(227,213,202,0.05))"
                            ]
                        }}
                        transition={{ 
                            duration: 1.2, 
                            ease: "easeOut",
                            filter: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="mb-6"
                    >
                        <PersonaMask 
                            personaId={personaId} 
                            size={160} 
                            className="w-32 h-32 md:w-48 md:h-48"
                            strokeWidth={0.8}
                        />
                    </motion.div>

                    {/* Subtitle - Letter-spacing animation */}
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.6em" }}
                        animate={{ opacity: 1, letterSpacing: "0.3em" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-persona-text/40 font-sans font-light text-sm uppercase tracking-[0.3em]"
                    >
                        {personaName}
                    </motion.p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
