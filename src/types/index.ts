export interface StreamServer {
  id: string;
  name: string;
  priority: number;
  baseUrl: string;
  movieUrl: (tmdbId: string) => string;
  tvUrl: (tmdbId: string, season: number, episode: number) => string;
  features: {
    autoplay?: boolean;
    subtitles?: boolean;
    quality?: string[];
  };
  healthCheck?: {
    url: string;
    timeout: number;
  };
}

export type MediaType = 'movie' | 'tv';

export interface WatchProgress {
  id: number;
  type: MediaType;
  season?: number;
  episode?: number;
  episodeName?: string;
  timestamp?: number;
  lastWatched: number;
}

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    priority: 1,
    baseUrl: 'https://multiembed.mov',
    movieUrl: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tvUrl: (id: string, s: number, e: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    features: {
      autoplay: true,
      subtitles: true,
      quality: ['1080p', '720p', '480p']
    },
    healthCheck: {
      url: 'https://multiembed.mov',
      timeout: 3000
    }
  }
];
