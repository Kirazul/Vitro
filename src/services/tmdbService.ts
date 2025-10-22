const TMDB_API_KEY = '1070730380f5fee0d87cf0382670b255';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  still_path: string | null;
  air_date: string;
}

export interface TMDBTVShow extends TMDBMedia {
  seasons: TMDBSeason[];
  number_of_seasons: number;
  number_of_episodes: number;
}

export interface TMDBSeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: TMDBEpisode[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

class TMDBService {
  async searchMulti(query: string): Promise<TMDBMedia[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results.filter((item: TMDBMedia) =>
      item.media_type === 'movie' || item.media_type === 'tv'
    );
  }

  async getMovieDetails(id: number): Promise<TMDBMedia> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
    );
    return response.json();
  }

  async getTVShowDetails(id: number): Promise<TMDBTVShow> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`
    );
    return response.json();
  }

  async getSeasonDetails(tvId: number, seasonNumber: number): Promise<TMDBSeasonDetails> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
    );
    return response.json();
  }

  async getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMedia[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  }

  async getMovieGenres(): Promise<TMDBGenre[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.genres;
  }

  async getTVGenres(): Promise<TMDBGenre[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.genres;
  }

  async discoverByGenre(
    mediaType: 'movie' | 'tv',
    genreId: number,
    page: number = 1
  ): Promise<TMDBMedia[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType
    }));
  }

  getPosterUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    if (!path) return 'https://via.placeholder.com/500x750/667eea/ffffff?text=No+Poster';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  }

  getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return 'https://via.placeholder.com/1280x720/667eea/ffffff?text=No+Image';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  }

  getTitle(media: TMDBMedia): string {
    return media.title || media.name || 'Unknown Title';
  }

  getYear(media: TMDBMedia): string {
    const date = media.release_date || media.first_air_date;
    return date ? date.split('-')[0] : 'N/A';
  }
}

export const tmdbService = new TMDBService();
