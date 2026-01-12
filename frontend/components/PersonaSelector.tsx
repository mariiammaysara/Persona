'use client';

/**
 * Props for PersonaSelector.
 */
interface PersonaSelectorProps {
    /** The ID of the currently active persona. */
    selectedPersona: string;
    /** Callback fired when a persona is selected. */
    onSelect: (id: string) => void;
}

const personas = [
    { id: 'Sherlock Holmes', name: 'Sherlock' },
    { id: 'Tony Stark', name: 'Tony' },
    { id: 'Yoda', name: 'Yoda' },
    { id: 'Hermione Granger', name: 'Hermione' },
    { id: 'Sleepy Cat', name: 'Mittens' },
];

/**
 * PersonaSelector Component.
 * Horizontal scrollable list of available personas with premium styling.
 */
export default function PersonaSelector({ selectedPersona, onSelect }: PersonaSelectorProps) {
    return (
        <div className="w-full max-w-6xl mx-auto z-50 select-none">
            <div className="flex items-center justify-center gap-12 py-2 px-6 overflow-x-auto scrollbar-hide mask-fade-sides">
                {personas.map((p) => {
                    const isSelected = selectedPersona === p.id;
                    return (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p.id)}
                            className={`
                flex-shrink-0 relative group flex items-center justify-center px-6 py-2 rounded-full transition-all duration-500 ease-out overflow-hidden
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

                            <span className="relative z-10 font-serif italic text-sm md:text-base tracking-wide font-medium whitespace-nowrap">
                                {p.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
