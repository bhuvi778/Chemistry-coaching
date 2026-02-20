import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

/**
 * MobilePdfViewer
 * Renders a PDF URL page-by-page using pdfjs-dist (canvas → jpeg images).
 * Designed for mobile inline use — no iframes, no redirects.
 */
const MobilePdfViewer = ({ url, title }) => {
    const [pages, setPages] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortRef = useRef(false);

    useEffect(() => {
        if (!url) return;

        abortRef.current = false;
        setPages([]);
        setTotalPages(0);
        setLoading(true);
        setError(null);

        const loadPdf = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch PDF');
                const arrayBuffer = await response.arrayBuffer();

                if (abortRef.current) return;

                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                if (abortRef.current) return;

                setTotalPages(pdf.numPages);

                const scale = 1.5;

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    if (abortRef.current) return;

                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvasContext: canvas.getContext('2d'),
                        viewport,
                    }).promise;

                    if (abortRef.current) return;

                    const imageData = canvas.toDataURL('image/jpeg', 0.85);

                    setPages(prev => [...prev, { pageNum, imageData, width: viewport.width, height: viewport.height }]);

                    // Show viewer after first page renders
                    if (pageNum === 1) setLoading(false);
                }
            } catch (err) {
                if (!abortRef.current) {
                    console.error('MobilePdfViewer error:', err);
                    setError('PDF load karne mein problem aayi. Please retry karein.');
                    setLoading(false);
                }
            }
        };

        loadPdf();

        return () => { abortRef.current = true; };
    }, [url]);

    if (loading && pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">PDF load ho rhi hai...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                <i className="fas fa-exclamation-circle text-red-400 text-4xl"></i>
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-900">
            {/* Progress bar while remaining pages load */}
            {pages.length < totalPages && totalPages > 0 && (
                <div className="sticky top-0 z-10 bg-gray-900/90 px-4 py-2 flex items-center gap-3 border-b border-gray-700">
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${(pages.length / totalPages) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{pages.length}/{totalPages}</span>
                </div>
            )}

            {/* Rendered pages */}
            <div className="flex flex-col gap-1">
                {pages.map(({ pageNum, imageData, width, height }) => (
                    <div key={pageNum} className="relative w-full select-none" style={{ aspectRatio: `${width}/${height}` }}>
                        <img
                            src={imageData}
                            alt={`${title} — Page ${pageNum}`}
                            className="w-full h-full object-contain pointer-events-none"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MobilePdfViewer;
