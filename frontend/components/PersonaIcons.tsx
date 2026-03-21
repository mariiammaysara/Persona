import React from 'react';

/**
 * Custom Persona Icons.
 * A collection of luxury-theme minimalist SVG icons for each persona.
 * Optimized for small scales (14px - 20px) with delicate strokes.
 */

interface IconProps {
    size?: number;
    className?: string;
}

export const SherlockIcon = ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.8" />
        <path d="M15 15L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10.5" cy="10.5" r="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
);

export const TonyIcon = ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.9" />
        <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M5 5L7 7M17 17L19 19M19 5L17 7M7 17L5 19" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
    </svg>
);

export const YodaIcon = ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M2 11C2 11 5 11 8 13C10 11 14 11 16 13C19 11 22 11 22 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        <path d="M12 15C11 15 10.5 16 10.5 17C10.5 18 11.5 19 12 19C12.5 19 13.5 18 13.5 17C13.5 16 13 15 12 15Z" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <path d="M7 8C7 8 8 7 12 7C16 7 17 8 17 8" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
    </svg>
);

export const HermioneIcon = ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.8" />
        <path d="M6.5 3H20V21H6.5C5.11929 21 4 19.8807 4 18.5V5.5C4 4.11929 5.11929 3 6.5 3Z" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
        <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 9H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="6" r="1" fill="currentColor" fillOpacity="0.6" />
    </svg>
);

export const CatIcon = ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 14C15 14 18 16 18 19V20H6V19C6 16 9 14 12 14Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M8 8C8 8 9 5 12 5C15 5 16 8 16 8" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.8" />
        <path d="M6 10L8 8M18 10L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="11" r="0.8" fill="currentColor" fillOpacity="0.6" />
        <circle cx="14" cy="11" r="0.8" fill="currentColor" fillOpacity="0.6" />
    </svg>
);
