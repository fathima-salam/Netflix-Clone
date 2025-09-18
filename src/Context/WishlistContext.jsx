import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserWishlist, addToWishlist, removeFromWishlist, checkIfInWishlist } from '../firebase';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userWishlist = await getUserWishlist(user.uid);
      setWishlist(userWishlist);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlistHandler = async (movieData) => {
    if (!user) return;

    try {
      await addToWishlist(user.uid, movieData);
      const newWishlistItem = {
        userId: user.uid,
        movieId: movieData.id,
        title: movieData.title,
        poster_path: movieData.poster_path,
        vote_average: movieData.vote_average,
        release_date: movieData.release_date,
        addedAt: new Date()
      };
      setWishlist(prev => [...prev, newWishlistItem]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlistHandler = async (movieId) => {
    if (!user) return;

    try {
      await removeFromWishlist(user.uid, movieId);
      setWishlist(prev => prev.filter(item => item.movieId !== movieId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (movieId) => {
    return wishlist.some(item => item.movieId === movieId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    isInWishlist,
    loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};