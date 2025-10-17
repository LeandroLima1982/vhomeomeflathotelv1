"use client";

import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  delay?: number; // Delay between each character, default to 50ms
  active: boolean; // Prop to control when the effect is active
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ text, delay = 50, active }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplayedText(''); // Reset when not active
      setCharIndex(0);
      return;
    }

    if (charIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, text, delay, active]);

  // When not active, or if the typing is complete, display the full text instantly.
  // The parent component will handle the overall visibility (opacity-0/100).
  return <>{active ? displayedText : text}</>;
};