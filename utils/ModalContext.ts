import React, { useState, useEffect } from 'react';

export const ReviewModalContext = React.createContext({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
});

export const useMovie = () => {
  const [movie, setMovie] = useState(null);

  return {
    movie,
    setMovie,
  };
};
