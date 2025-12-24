import React from 'react';

const ScrollToTopButton = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div 
            style={{
                position: 'fixed',
                bottom: '150px',
                right: '20px',
                zIndex: 999999
            }}
        >
            <button
                onClick={scrollToTop}
                style={{ 
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.6)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                }}
                aria-label="Scroll to top"
                title="Back to top"
            >
                <svg
                    style={{
                        width: '24px',
                        height: '24px'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ScrollToTopButton;
