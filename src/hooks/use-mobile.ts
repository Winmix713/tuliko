// src/hooks/use-mobile.ts (example)
import { useState, useEffect } from 'react';

export function useMobile(query: string = '(max-width: 768px)'): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = () => setIsMobile(mediaQuery.matches);

    // Initial check
    handler();

    // Listen for changes
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return isMobile;
}

// Make sure the 'export' keyword is present!