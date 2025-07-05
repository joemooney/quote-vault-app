export type Quote = {
  id: number;
  text: string;
  author: string;
  tags: string[];
  meaning?: string;
  origin?: string;
  trivia?: string;
};
