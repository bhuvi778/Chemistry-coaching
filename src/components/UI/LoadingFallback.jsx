import React from 'react';

const LoadingFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full">
            <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-cyan-500 border-t-transparent shadow-md"></div>
            </div>
        </div>
    );
};

export default LoadingFallback;
