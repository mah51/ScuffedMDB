/* eslint-disable @typescript-eslint/no-empty-function */
import { PopulatedUserType } from './../models/user';
import React, { Dispatch, SetStateAction } from 'react';
import { ReviewType, SerializedMovieType } from '../models/movie';

interface ReviewContext {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  movie: null | SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  setMovie: Dispatch<
    SetStateAction<SerializedMovieType<ReviewType<PopulatedUserType>[]> | null>
  >;
}

export const ReviewModalContext = React.createContext<ReviewContext>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  movie: null,
  setMovie: () => {},
});
