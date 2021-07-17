import { useEffect, useState } from 'react';

export default function useScrollPosition(): { scrollPosition: number } {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = (e: Event) => {
    const { target } = e;
    if (target) setScrollPosition((target as HTMLDivElement).scrollTop);
  };

  useEffect(() => {
    if (document) {
      document
        .getElementById('__next')
        ?.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        document
          .getElementById('__next')
          ?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollPosition]);
  return { scrollPosition };
}
