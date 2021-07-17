/* eslint-disable @typescript-eslint/no-empty-function */
import { PopulatedUserType } from './../models/user';
import React, { useState } from 'react';
import { ReviewType, SerializedMovieType } from '../models/movie';

export const ReviewModalContext = React.createContext({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
});

export const useMovie = (): {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]> | null;
  setMovie: (
    x: SerializedMovieType<ReviewType<PopulatedUserType>[]> | null
  ) => void;
} => {
  const [movie, setMovie] = useState<null | SerializedMovieType<
    ReviewType<PopulatedUserType>[]
  >>(null);

  return {
    movie,
    setMovie,
  };
};
