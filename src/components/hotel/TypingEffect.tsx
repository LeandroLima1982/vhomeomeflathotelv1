"use client";

import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  delay?: number; // Delay between each word, default to 50ms
  active: boolean; // Prop to control when the effect is active
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ text, delay = 50, active }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const words = text.split(' '); // Divide o texto em palavras

  useEffect(() => {
    if (!active) {
      setDisplayedText(''); // Reset when not active
      setWordIndex(0);
      return;
    }

    if (wordIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => (prev ? prev + ' ' : '') + words[wordIndex]);
        setWordIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [wordIndex, words, delay, active]);

  // When not active, or if the typing is complete, display the full text instantly.
  return <>{active ? displayedText : text}</>;
};