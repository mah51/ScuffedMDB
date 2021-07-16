export const getTotalCharCode = (phrase: string): number => {
  return phrase.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
};
