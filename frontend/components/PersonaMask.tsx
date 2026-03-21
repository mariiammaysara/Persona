import React from 'react';
import { motion } from 'framer-motion';

/**
 * PersonaMask Component.
 * A dynamic SVG that evolves the base "Theatrical Mask" based on the selected persona.
 * Maintains the luxury minimalist aesthetic with character-specific traits.
 */

interface PersonaMaskProps {
  personaId: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  showDetails?: boolean;
}

export default function PersonaMask({ 
  personaId, 
  size = 120, 
  className = "", 
  strokeWidth = 0.8,
  showDetails = true 
}: PersonaMaskProps) {
  
  // Base Path: The core mask face
  const baseFace = "M60 10C35 10 20 30 20 55C20 80 35 105 60 115C85 105 100 80 100 55C100 30 85 10 60 10Z";

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 1. Base Mask Outline */}
      <motion.path 
        d={baseFace}
        stroke="#E3D5CA" 
        strokeWidth={strokeWidth} 
        strokeOpacity="0.5" 
        transition={{ duration: 0.8 }}
      />

      {/* 2. Character-Specific "Add-ons" (Ears, etc.) */}
      {personaId === 'yoda' && (
        <React.Fragment>
          {/* Yoda ears */}
          <motion.path 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            d="M20 55C5 50 -5 55 -5 68C5 68 15 62 20 55" 
            stroke="#E3D5CA" strokeWidth={strokeWidth * 0.8} strokeOpacity="0.4"
          />
          <motion.path 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            d="M100 55C115 50 125 55 125 68C115 68 105 62 100 55" 
            stroke="#E3D5CA" strokeWidth={strokeWidth * 0.8} strokeOpacity="0.4"
          />
        </React.Fragment>
      )}

      {personaId === 'mittens' && (
        <React.Fragment>
          {/* Cat ears */}
          <motion.path 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            d="M32 15L25 2L48 12" 
            stroke="#E3D5CA" strokeWidth={strokeWidth} strokeOpacity="0.5"
          />
          <motion.path 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            d="M88 15L95 2L72 12" 
            stroke="#E3D5CA" strokeWidth={strokeWidth} strokeOpacity="0.5"
          />
        </React.Fragment>
      )}

      {/* 3. Eyes - Dynamic based on Persona */}
      <motion.g>
        {personaId === 'sherlock' ? (
          <>
            <path d="M38 52C43 49 53 49 58 52" stroke="#E3D5CA" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="1" />
            <path d="M62 52C67 49 77 49 82 52" stroke="#E3D5CA" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="1" />
            {/* Sherlock Lens detail */}
            <circle cx="48" cy="52" r="6" stroke="#E3D5CA" strokeWidth="0.3" strokeOpacity="0.2" />
          </>
        ) : personaId === 'tony_stark' ? (
          <>
            <path d="M35 52H55" stroke="#E3D5CA" strokeWidth="2.5" strokeOpacity="1" />
            <path d="M65 52H85" stroke="#E3D5CA" strokeWidth="2.5" strokeOpacity="1" />
          </>
        ) : personaId === 'yoda' ? (
          <>
            <path d="M35 55C40 52 50 52 55 55" stroke="#E3D5CA" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
            <path d="M65 55C70 52 80 52 85 55" stroke="#E3D5CA" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
          </>
        ) : (
          <>
            <path d="M38 52C43 49 53 49 58 52" stroke="#E3D5CA" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.9" />
            <path d="M62 52C67 49 77 49 82 52" stroke="#E3D5CA" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.9" />
          </>
        )}
      </motion.g>

      {/* 4. Internal Decorative Details */}
      {showDetails && (
        <React.Fragment>
          {/* Subtle Inner Glow Arc */}
          <path d="M30 40C35 25 50 20 60 20C70 20 85 25 90 40" stroke="#E3D5CA" strokeWidth="0.3" strokeOpacity="0.2" />
          
          {/* Central Line of Symmetry */}
          <line x1="60" y1="10" x2="60" y2="115" stroke="#E3D5CA" strokeWidth="0.2" strokeOpacity="0.1" />

          {/* Character-Specific Mouth/Detail */}
          {personaId === 'tony_stark' ? (
             <circle cx="60" cy="95" r="5" stroke="#E3D5CA" strokeWidth="0.8" strokeOpacity="0.6" fill="#E3D5CA" fillOpacity="0.1" />
          ) : (
             <path d="M45 85C50 92 70 92 75 85" stroke="#E3D5CA" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
          )}

          {/* Bottom Dot */}
          <circle cx="60" cy="115" r="1.2" fill="#E3D5CA" fillOpacity="0.6" />
        </React.Fragment>
      )}
    </svg>
  );
}
