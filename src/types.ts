export type SearchItem = {
  title: string;
  url: string;
  description: string;
}

export type SearchResult = {
  items: SearchItem[];
  count: number;
  timeTaken: number;
}