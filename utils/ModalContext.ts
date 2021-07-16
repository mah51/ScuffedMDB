/* eslint-disable @typescript-eslint/no-empty-function */
import { PopulatedUserType } from './../models/user';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { ReviewType, SerializedMovieType } from '../models/movie';

export const ReviewModalContext = React.createContext({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
});

export const useMovie = (): {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]> | null;
  setMovie:
    | Dispatch<
        SetStateAction<SerializedMovieType<ReviewType<PopulatedUserType>[]>>
      >
    | Dispatch<SetStateAction<null>>;
} => {
  const [movie, setMovie] = useState(null);

  return {
    movie,
    setMovie,
  };
};
