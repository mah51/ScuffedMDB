/* eslint-disable @typescript-eslint/no-empty-function */
import { PopulatedUserType } from './../models/user';
import React, { useState, useEffect } from 'react';
import { ReviewType, SerializedMovieType } from '../models/movie';

export const ReviewModalContext = React.createContext({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  movie: null,
  setMovie: (
    x: SerializedMovieType<ReviewType<PopulatedUserType>[]> | null
  ) => {
    return x;
  },
});
