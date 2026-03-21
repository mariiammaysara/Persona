'use client';

import { personas } from '@/lib/personaConfig';
import { motion } from 'framer-motion';

/**
 * Props for PersonaSelector.
 */
interface PersonaSelectorProps {
    /** The ID of the currently active persona. */
    selectedPersona: string;
    /** Callback fired when a persona is selected. */
    onSelect: (id: string) => void;
}

/**
 * PersonaSelector Component.
 * Horizontal floating persona buttons with enhanced highlight glow.
 * Optimized for clarity and a premium "lit" aesthetic.
 */
export default function PersonaSelector({ selectedPersona, onSelect }: PersonaSelectorProps) {
    return (
        <div className="flex items-center justify-center gap-4 md:gap-10 px-8 py-4 bg-[#0A0908] border border-[#E3D5CA]/5 rounded-3xl shadow-2xl backdrop-blur-xl pointer-events-auto">
            {Object.entries(personas).map(([id, config]) => {
                const isSelected = selectedPersona === id;
                const Icon = config.icon;

                return (
                    <motion.button
                        key={id}
                        onClick={() => onSelect(id)}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: isSelected ? undefined : "#252525",
                        }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            flex-shrink-0 relative group flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-2xl transition-all duration-500 ease-out
                            ${isSelected
                                ? 'bg-persona-text text-persona-bg border border-persona-text/30 shadow-[0_0_15px_rgba(227,213,202,0.2)] scale-105'
                                : 'bg-[#1a1a1a] border border-persona-text/10 text-persona-text/50 hover:text-persona-text hover:bg-[#222222] hover:border-persona-text/30'
                            }
                        `}
                    >
                        {/* Soft Aura/Glow behind the selected button */}
                        {isSelected && (
                            <motion.div 
                                layoutId="glow"
                                className="absolute inset-0 rounded-2xl bg-persona-text/5 blur-md"
                            />
                        )}

                        <Icon size={14} className={`relative z-10 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />

                        <span className={`relative z-10 font-serif italic text-xs md:text-sm tracking-widest transition-all duration-300 whitespace-nowrap ${isSelected ? 'text-persona-bg font-bold opacity-100' : 'text-persona-text font-medium opacity-70'}`}>
                            {config.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
