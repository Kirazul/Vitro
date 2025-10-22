import { STREAM_SERVERS, type StreamServer } from '../types';

export async function getStreamUrl(
  tmdbId: string,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number
): Promise<{ url: string; server: StreamServer }> {
  const server = STREAM_SERVERS[0];

  let url: string;
  if (type === 'movie') {
    url = server.movieUrl(tmdbId);
  } else if (type === 'tv' && season !== undefined && episode !== undefined) {
    url = server.tvUrl(tmdbId, season, episode);
  } else {
    throw new Error('Invalid parameters for TV show stream');
  }

  return { url, server };
}
