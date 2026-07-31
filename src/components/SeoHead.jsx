import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_ORIGIN = 'https://www.ace2examz.com';

/**
 * Keep the canonical URL tied to the current client-side route.
 * This prevents every SPA route from inheriting the homepage URL and
 * makes the canonical signal independent of the page that linked to us.
 */
export default function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    const routePath = location.pathname === '/home' ? '/' : location.pathname;
    const canonicalUrl = new URL(routePath || '/', SITE_ORIGIN).toString();

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [location.pathname]);

  return null;
}
