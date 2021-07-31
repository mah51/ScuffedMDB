import { SerializedMovieType } from './../models/movie';
export const getTotalCharCode = (phrase: string): number => {
  return phrase.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
};

export const getColorSchemeCharCode = (
  phrase: string,
  colors: string[] = [
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'blue',
    'cyan',
    'pink',
    'purple',
  ]
): string => {
  return colors[getTotalCharCode(phrase) % colors.length];
};

export const getMovieGenres = (movies: SerializedMovieType[]): string[] => {
  return movies.reduce((a: string[], c: SerializedMovieType) => {
    const genres = c.genres;
    //@ts-ignore
    return [...new Set([...a, ...genres])];
  }, []);
};
