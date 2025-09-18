import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../Context/WishlistContext'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import './MyList.css'

const MyList = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  const handleRemove = (movieId, event) => {
    event.preventDefault();
    event.stopPropagation();
    removeFromWishlist(movieId);
  };

  if (loading) {
    return (
      <div className="my-list">
        <Navbar />
        <div className="my-list-container">
          <h1>My List</h1>
          <div className="loading">Loading your list...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-list">
      <Navbar />
      <div className="my-list-container">
        <div className="my-list-header">
          <h1>My List</h1>
          <span className="list-count">{wishlist.length} titles in your list</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-list">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M32 8L36 20H48L38.32 28L42 40L32 32L22 40L25.68 28L16 20H28L32 8Z" fill="#666"/>
              </svg>
            </div>
            <h2>Your list is empty</h2>
            <p>Browse our extensive library and add movies to your list for easy access later.</p>
            <Link to="/browse" className="start-browsing-btn">
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((movie) => (
              <div key={movie.movieId} className="movie-card-wishlist">
                <Link to={`/details/${movie.movieId}`} className="movie-link">
                  <div className="movie-poster-container">
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="movie-overlay">
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <div className="movie-meta">
                          <span className="rating">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                          <span className="year">{movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</span>
                        </div>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={(e) => handleRemove(movie.movieId, e)}
                        title="Remove from My List"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MyList