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

        // Disable paste
        const handlePaste = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable text selection
        const handleSelectStart = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts
        const handleKeyDown = (e) => {
            // Disable F12 (DevTools)
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }

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

            // Disable Ctrl+V (Paste)
            if (e.ctrlKey && e.keyCode === 86) {
                e.preventDefault();
                return false;
            }

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
        document.addEventListener('paste', handlePaste);
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
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleSelectStart);
            document.head.removeChild(style);
        };
    }, []);

    return null; // This component doesn't render anything
};

export default ContentProtection;
