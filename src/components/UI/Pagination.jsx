import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const paginate = (pageNumber) => {
        onPageChange(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
            {/* Previous Button */}
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 1
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                    }`}
            >
                <i className="fas fa-chevron-left mr-2"></i>
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2 flex-wrap justify-center">
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                className={`w-10 h-10 rounded-lg font-bold transition ${currentPage === pageNumber
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                    ) {
                        return <span key={pageNumber} className="text-gray-600 px-2">...</span>;
                    }
                    return null;
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === totalPages
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                    }`}
            >
                Next
                <i className="fas fa-chevron-right ml-2"></i>
            </button>
        </div>
    );
};

export default Pagination;
