export type StreamSource = {
  url: string;
  quality: '360p' | '480p' | '720p' | '1080p' | 'default';
  isM3U8: boolean;
};

export type StreamResponse = {
  sources: StreamSource[];
  subtitles: { url: string; lang: string }[];
  // Headers required by the CDN (e.g., Referer)
  // If present, our proxy will use these to fetch segments
  headers?: Record<string, string>;
};