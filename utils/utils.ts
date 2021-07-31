import { SerializedMovieType } from './../models/movie';
export const getTotalCharCode = (phrase: string): number => {
  return phrase.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
};

/**
 * @description Returns a color based on the hash of the string
 * @author mah51 <https://github.com/mah51>
 * @param {string} phrase
 * @param {string[]} [colors=[
 *     'red',
 *     'orange',
 *     'yellow',
 *     'green',
 *     'teal',
 *     'blue',
 *     'cyan',
 *     'pink',
 *     'purple',
 *   ]]
 * @return {*}  {string}
 */
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

/**
 * @description Returns an array of non-duplicate genres from provided movies.
 * @author mah51 <https://github.com/mah51>
 * @param {SerializedMovieType[]} movies
 * @return {*}  {string[]}
 */

export const getMovieGenres = (movies: SerializedMovieType[]): string[] => {
  return movies.reduce((a: string[], c: SerializedMovieType) => {
    const genres = c.genres;
    //@ts-ignore
    return [...new Set([...a, ...genres])];
  }, []);
};
