import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import './Details.css'
import Favorite from '../../assets/favorite.svg'
import hero_title from '../../assets/hero_title.png'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import back_arrow from '../../assets/back_arrow_icon.png'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { useWishlist } from '../../Context/WishlistContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase'

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [apiData, setApiData] = useState({
    id: null,
    title: "",
    backdrop_path: "",
    poster_path: "",
    tagline: "",
    release_date: "",
    genres: [],
    production_companies: [],
    homepage: "",
    overview: "",
    vote_average: 0,
    runtime: 0
  })

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRlNzc5NmMwNmRlZDlhN2Q5NGE2YmE4OGYwYzk1ZSIsIm5iZiI6MTc1Nzg1ODEyOS44MDMsInN1YiI6IjY4YzZjOTUxZTQ0ZmRhZTk5OWYyMWQzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Zq9Tb9DsphrEdvfRNWI-clqgTGXo3RUo1vj3IRsIfUc'
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then(res => res.json())
      .then(res => setApiData({...res, id: parseInt(id)}))
      .catch(err => console.error(err));
  }, [id])

  const handleBack = () => {
    navigate(-1);
  }

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist(parseInt(id))) {
      removeFromWishlist(parseInt(id));
    } else {
      addToWishlist({
        id: parseInt(id),
        title: apiData.title,
        poster_path: apiData.poster_path,
        vote_average: apiData.vote_average,
        release_date: apiData.release_date
      });
    }
  }

  const inWishlist = user ? isInWishlist(parseInt(id)) : false;

  return (
    <div className="details">
      <Navbar />
      <div className="hero">
        <img
          src={apiData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${apiData.backdrop_path}` : ''}
          alt=""
          className='banner-img'
        />
        <div className="hero_caption">
          <h1 className='hero-title'>{apiData.title}</h1>
          <p className='tagline'>{apiData.tagline}</p>
          
          <div className="movie-info">
            <span className="rating">⭐ {apiData.vote_average ? apiData.vote_average.toFixed(1) : 'N/A'}</span>
            <span className="runtime">{apiData.runtime ? `${apiData.runtime} min` : ''}</span>
            <span className="release-year">{apiData.release_date ? new Date(apiData.release_date).getFullYear() : ''}</span>
          </div>

          <div className="hero-btns">
            <Link to={`/player/${id}`} className="btn-link">
              <button className='btn'>
                <img src={play_icon} alt="" />
                Play
              </button>
            </Link>
            <button 
              className={`btn fav-btn ${inWishlist ? 'in-wishlist' : ''}`}
              onClick={handleWishlistToggle}
            >
              <img src={Favorite} alt="" />
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button className='btn dark-btn' onClick={handleBack}>
              <img src={back_arrow} alt="" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Movie details */}
      <div className="movie-container">
        <div className="movie-card">
          <div className="movie-poster">
            <div className="rating-badge">
              {apiData.vote_average ? apiData.vote_average.toFixed(1) : 'N/A'}
            </div>
            <img
              src={apiData.poster_path ? `https://image.tmdb.org/t/p/w500${apiData.poster_path}` : ''}
              alt={`${apiData.title} Movie Poster`}
            />
          </div>
          
          <div className="movie-details">
            {/* Overview Section */}
            <div className="detail-section">
              <h3 className="section-title">OVERVIEW</h3>
              <p className="overview">{apiData.overview}</p>
            </div>

            <div className="detail-section">
              <h3 className="section-title">GENRES</h3>
              <div className="genre-tags">
                {apiData.genres && apiData.genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">RELEASE DATE</h3>
              <p className="release-date">
                {apiData.release_date ? new Date(apiData.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
              </p>
            </div>

            <div className="detail-section">
              <h3 className="section-title">PRODUCTION COMPANIES</h3>
              <ul className="production-list">
                {apiData.production_companies && apiData.production_companies.map((company, index) => (
                  <li key={index}>{company.name}</li>
                ))}
              </ul>
            </div>

            {/* Homepage link if available */}
            {apiData.homepage && (
              <div className="detail-section">
                <h3 className="section-title">OFFICIAL WEBSITE</h3>
                <a 
                  href={apiData.homepage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="homepage-link"
                >
                  Visit Official Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Details