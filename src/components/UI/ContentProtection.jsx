import { useEffect } from 'react';

const ContentProtection = () => {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable copy
        const handleCopy = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable cut
        const handleCut = (e) => {
            e.preventDefault();
            return false;
        };

        // PASTE IS NOW ALLOWED - removed handlePaste

        // Disable text selection
        const handleSelectStart = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts
        const handleKeyDown = (e) => {
            // DEVTOOLS NOW ALLOWED - removed F12 blocking
            // DEVTOOLS NOW ALLOWED - removed Ctrl+Shift+I blocking
            // DEVTOOLS NOW ALLOWED - removed Ctrl+Shift+J blocking

            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+S (Save)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+C (Copy)
            if (e.ctrlKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+X (Cut)
            if (e.ctrlKey && e.keyCode === 88) {
                e.preventDefault();
                return false;
            }

            // PASTE IS NOW ALLOWED - removed Ctrl+V blocking

            // Disable Ctrl+A (Select All)
            if (e.ctrlKey && e.keyCode === 65) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+P (Print)
            if (e.ctrlKey && e.keyCode === 80) {
                e.preventDefault();
                return false;
            }
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);
        // PASTE IS NOW ALLOWED - removed paste event listener
        document.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('keydown', handleKeyDown);

        // Disable drag and drop
        document.addEventListener('dragstart', handleSelectStart);

        // Add CSS to disable text selection
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
            }
            
            /* Allow selection in input fields and textareas */
            input, textarea, [contenteditable="true"] {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        `;
        document.head.appendChild(style);

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            // PASTE IS NOW ALLOWED - removed paste cleanup
            document.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleSelectStart);
            document.head.removeChild(style);
        };
    }, []);

    return null; // This component doesn't render anything
};

export default ContentProtection;
