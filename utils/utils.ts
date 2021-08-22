import { UserAuthType } from 'next-auth';
import { SerializedMovieType, MovieType, ReviewType } from './../models/movie';

export const getTotalCharCode = (phrase: string): number => {
  return phrase?.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
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
  colors: string[] = themeColors
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

interface WebhookData {
  type: 'movie' | 'review';
  action: 'added' | 'modified' | 'deleted';
  user?: UserAuthType;
  movie: MovieType<ReviewType<string>[]> | MovieType;
  review?: ReviewType<string>;
}

export const postDataToWebhook = (data: WebhookData): void => {
  if (!process.env.WEBHOOK_URL) return;
  if (!process.env.WEBHOOK_TOKEN) {
    return console.error('Must provide a webhook token to send webhooks');
  }

  fetch(process.env.WEBHOOK_URL + `/api/event/${data?.type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
    },
    body: JSON.stringify(data),
  })
    // eslint-disable-next-line no-console
    .then(() => console.log('posted data to webhook'))
    .catch(() => console.error('failed to post data to webhook'));
};

export const themeColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'pink',
  'gray',
  'purple',
];

export const secondaryThemeColors: Record<string, string> = {
  red: 'yellow',
  orange: 'yellow',
  yellow: 'red',
  green: 'teal',
  teal: 'purple',
  blue: 'pink',
  cyan: 'purple',
  pink: 'purple',
  purple: 'cyan',
  gray: 'red',
};

export const getSecondaryAccentColor = (): string => {
  if (process.env.SECONDARY_COLOR_THEME) {
    return process.env.SECONDARY_COLOR_THEME;
  }
  return secondaryThemeColors[process.env.COLOR_THEME || 'purple'];
};
