import React from 'react';

const LoadingFallback = () => {
    return (
        <div className="min-h-[70vh] w-full px-4 py-10 max-w-6xl mx-auto animate-pulse">
            {/* Page title skeleton */}
            <div className="h-8 bg-gray-700/40 rounded-xl w-64 mb-2" />
            <div className="h-4 bg-gray-700/30 rounded-xl w-40 mb-10" />

            {/* Card grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-gray-700/40 bg-gray-800/30 p-6 flex flex-col gap-3"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="h-5 bg-gray-700/50 rounded-lg w-3/4" />
                        <div className="h-4 bg-gray-700/30 rounded-lg w-full" />
                        <div className="h-4 bg-gray-700/30 rounded-lg w-5/6" />
                        <div className="h-4 bg-gray-700/20 rounded-lg w-2/3 mt-2" />
                        <div className="mt-4 h-9 bg-cyan-700/20 rounded-xl w-28" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingFallback;
