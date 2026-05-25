export const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Brooks+User&background=7c3aed&color=fff";

export const GENRES = [
  { id: 1, name: "Action", slug: "action", color: "from-red-500 to-orange-500" },
  { id: 2, name: "Adventure", slug: "adventure", color: "from-amber-500 to-yellow-500" },
  { id: 4, name: "Comedy", slug: "comedy", color: "from-yellow-400 to-lime-400" },
  { id: 8, name: "Drama", slug: "drama", color: "from-blue-500 to-cyan-500" },
  { id: 10, name: "Fantasy", slug: "fantasy", color: "from-purple-500 to-violet-500" },
  { id: 14, name: "Horror", slug: "horror", color: "from-zinc-700 to-red-900" },
  { id: 22, name: "Romance", slug: "romance", color: "from-pink-500 to-rose-500" },
  { id: 24, name: "Sci-Fi", slug: "sci-fi", color: "from-cyan-500 to-blue-600" },
  { id: 27, name: "Shounen", slug: "shounen", color: "from-orange-500 to-red-500" },
  { id: 36, name: "Slice of Life", slug: "slice-of-life", color: "from-green-400 to-teal-400" },
  { id: 37, name: "Supernatural", slug: "supernatural", color: "from-indigo-500 to-purple-600" },
  { id: 41, name: "Thriller", slug: "thriller", color: "from-slate-600 to-zinc-800" },
] as const;

export const SEASONS = ["winter", "spring", "summer", "fall"] as const;

export type SeasonName = (typeof SEASONS)[number];
