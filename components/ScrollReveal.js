'use client';

import { useEffect } from 'react';

/**
 * Adds a gentle fade-up to every [data-reveal] element when it scrolls into view.
 * CSS only hides those elements once this component has mounted, so the page is
 * fully readable with JavaScript disabled or if IntersectionObserver is absent.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
