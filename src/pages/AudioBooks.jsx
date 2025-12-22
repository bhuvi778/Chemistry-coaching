import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AudioBooks = () => {
  const { audioBooks } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAudioBooks = selectedCategory === 'all' 
    ? audioBooks 
    : audioBooks.filter(book => book.category === selectedCategory);

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fas fa-headphones mr-3"></i>
            Chemistry Audio Books
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Learn chemistry on the go with our comprehensive audio book collection
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full transition ${
              selectedCategory === 'all' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setSelectedCategory('Physical Chemistry')}
            className={`px-6 py-2 rounded-full transition ${
              selectedCategory === 'Physical Chemistry' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Physical Chemistry
          </button>
          <button 
            onClick={() => setSelectedCategory('Organic Chemistry')}
            className={`px-6 py-2 rounded-full transition ${
              selectedCategory === 'Organic Chemistry' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Organic Chemistry
          </button>
          <button 
            onClick={() => setSelectedCategory('Inorganic Chemistry')}
            className={`px-6 py-2 rounded-full transition ${
              selectedCategory === 'Inorganic Chemistry' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Inorganic Chemistry
          </button>
        </div>

        {/* Audio Books Grid */}
        {filteredAudioBooks.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <i className="fas fa-headphones text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Audio Books Found</h3>
            <p className="text-gray-400">Audio books will be available soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudioBooks.map((book) => (
              <div key={book._id} className="glass-panel rounded-xl p-6 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
                {book.thumbnailUrl && (
                  <img 
                    src={book.thumbnailUrl} 
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white flex-1">{book.title}</h3>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    {book.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{book.description}</p>
                {book.author && (
                  <p className="text-gray-500 text-sm mb-2">
                    <i className="fas fa-user mr-2"></i>
                    {book.author}
                  </p>
                )}
                {book.duration && (
                  <p className="text-gray-500 text-sm mb-4">
                    <i className="fas fa-clock mr-2"></i>
                    {book.duration}
                  </p>
                )}
                <a 
                  href={book.audioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold"
                >
                  <i className="fas fa-play"></i>
                  Listen Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioBooks;
