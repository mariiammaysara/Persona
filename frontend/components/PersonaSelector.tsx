'use client';

import { personas } from '@/lib/personaConfig';

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
 * Horizontal scrollable list of available personas with premium styling.
 */
export default function PersonaSelector({ selectedPersona, onSelect }: PersonaSelectorProps) {
    return (
        <div className="w-full max-w-6xl mx-auto z-50 select-none">
            <div className="flex items-center justify-center gap-12 py-2 px-6 overflow-x-auto scrollbar-hide mask-fade-sides">
                {Object.entries(personas).map(([id, config]) => {
                    const isSelected = selectedPersona === id;
                    const Icon = config.icon;

                    return (
                        <button
                            key={id}
                            onClick={() => onSelect(id)}
                            className={`
                flex-shrink-0 relative group flex items-center justify-center gap-2 px-6 py-2 rounded-full transition-all duration-500 ease-out overflow-hidden
                ${isSelected
                                    ? 'bg-persona-text text-persona-bg border-[0.5px] border-persona-text shadow-[0_0_15px_rgba(227,213,202,0.4)]'
                                    : 'bg-transparent border border-persona-text/20 text-persona-text/70 hover:border-persona-text/50 hover:bg-persona-text/5'}
              `}
                        >
                            {/* Shimmer Effect on Edge for Selected */}
                            {isSelected && (
                                <div className="absolute inset-0 rounded-full ring-1 ring-white/50 animate-pulse"></div>
                            )}

                            {/* Subtle Shine sweep for unselected hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

                            <Icon size={16} className={`relative z-10 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />

                            <span className="relative z-10 font-serif italic text-sm md:text-base tracking-wide font-medium whitespace-nowrap">
                                {config.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
