import { lazy } from 'react';

/**
 * A wrapper around React.lazy() that automatically reloads the page
 * when a chunk fails to load (typically due to a new deployment).
 *
 * @param {Function} componentImport The dynamic import function, e.g. () => import('./Component')
 * @returns {React.LazyExoticComponent}
 */
export const lazyWithRetry = (componentImport) =>
    lazy(async () => {
        const pageHasAlreadyBeenForceRefreshed = JSON.parse(
            window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
        );

        try {
            const component = await componentImport();
            window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
            return component;
        } catch (error) {
            console.error('Lazy load error:', error);
            // Check for common chunk load errors
            // 'Failed to fetch dynamically imported module' is the standard one for Vite/Rollup
            // 'Importing a module script failed' is another common variation
            // We also check for network errors if possible, though they usually manifest as the above.
            const isChunkLoadError =
                error.message.includes('Failed to fetch dynamically imported module') ||
                error.message.includes('Importing a module script failed') ||
                error.name === 'ChunkLoadError';

            if (isChunkLoadError && !pageHasAlreadyBeenForceRefreshed) {
                console.log('Chunk load error detected. Reloading page...');
                window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                window.location.reload();
                // Return a promise that never resolves so the error boundary doesn't trigger immediately
                return new Promise(() => { });
            }

            // If we've already reloaded or it's a different error, throw it
            throw error;
        }
    });

export default lazyWithRetry;
