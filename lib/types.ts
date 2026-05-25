export type JikanImageSet = {
  jpg?: {
    image_url?: string;
    large_image_url?: string;
  };
};

export type JikanGenre = {
  mal_id: number;
  name: string;
};

export type JikanAnime = {
  mal_id: number;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  images: JikanImageSet;
  score?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  year?: number | null;
  season?: string;
  status?: string;
  type?: string;
  synopsis?: string;
  episodes?: number | null;
  genres?: JikanGenre[];
  broadcast?: { time?: string; day?: string; string?: string };
  airingEpisode?: { episode?: number };
  trailer?: { embed_url?: string | null; url?: string | null };
};

export type JikanCharacter = {
  mal_id: number;
  name: string;
  images?: JikanImageSet;
  favorites?: number;
};

export type JikanRecommendation = {
  entry?: JikanAnime[];
};

/** Raw shape from GET /anime/{id}/news */
export type JikanRawNewsItem = {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  excerpt: string;
  images?: JikanImageSet;
};

export type JikanNewsItem = {
  mal_id: number;
  title: string;
  image: string;
  summary: string;
  date: string;
  author: string;
  url: string;
};

export type JikanApiResponse<T> = {
  data: T;
};

export type WatchHistoryEntry = {
  id: string;
  title: string;
  ep: number;
  time: string;
};
