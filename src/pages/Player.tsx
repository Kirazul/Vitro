import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Calendar, Film, Tv } from 'lucide-react';
import Balatro from '../components/Balatro';
import { tmdbService, type TMDBMedia, type TMDBTVShow, type TMDBEpisode } from '../services/tmdbService';
import { getStreamUrl } from '../services/streamingService';
import { storageService } from '../services/storageService';
import { cn } from '../lib/utils';

export default function Player() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();

  const [media, setMedia] = useState<TMDBMedia | TMDBTVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');

  // TV Show specific state
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  // Load media details
  useEffect(() => {
    const loadMedia = async () => {
      if (!id || !type) return;

      setLoading(true);
      try {
        let mediaData: TMDBMedia | TMDBTVShow;
        if (type === 'movie') {
          mediaData = await tmdbService.getMovieDetails(Number(id));
        } else {
          mediaData = await tmdbService.getTVShowDetails(Number(id));

          // Load last watched episode from progress
          const progress = storageService.getWatchProgress();
          const savedProgress = progress.find(p => p.id === Number(id) && p.type === 'tv');

          if (savedProgress && savedProgress.season && savedProgress.episode) {
            setSelectedSeason(savedProgress.season);
            setSelectedEpisode(savedProgress.episode);
          }
        }
        setMedia(mediaData);
      } catch (error) {
        console.error('Error loading media:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [id, type]);

  // Load episodes for TV shows
  useEffect(() => {
    const loadEpisodes = async () => {
      if (type !== 'tv' || !id) return;

      try {
        const seasonData = await tmdbService.getSeasonDetails(Number(id), selectedSeason);
        setEpisodes(seasonData.episodes);
      } catch (error) {
        console.error('Error loading episodes:', error);
      }
    };

    if (type === 'tv') {
      loadEpisodes();
    }
  }, [type, id, selectedSeason]);

  // Load stream URL
  useEffect(() => {
    const loadStream = async () => {
      if (!id || !type) return;

      try {
        const { url } = await getStreamUrl(
          id,
          type,
          type === 'tv' ? selectedSeason : undefined,
          type === 'tv' ? selectedEpisode : undefined
        );
        setStreamUrl(url);

        // Save progress
        if (type === 'movie') {
          storageService.saveWatchProgress({ id: Number(id), type: 'movie' });
        } else {
          const currentEpisode = episodes.find(e => e.episode_number === selectedEpisode);
          storageService.saveWatchProgress({
            id: Number(id),
            type: 'tv',
            season: selectedSeason,
            episode: selectedEpisode,
            episodeName: currentEpisode?.name
          });
        }
      } catch (error) {
        console.error('Error loading stream:', error);
      }
    };

    loadStream();
  }, [id, type, selectedSeason, selectedEpisode, episodes]);


  const handleEpisodeChange = useCallback((direction: 'prev' | 'next') => {
    if (type !== 'tv') return;

    const currentIndex = episodes.findIndex(e => e.episode_number === selectedEpisode);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedEpisode(episodes[currentIndex - 1].episode_number);
    } else if (direction === 'next' && currentIndex < episodes.length - 1) {
      setSelectedEpisode(episodes[currentIndex + 1].episode_number);
    }
  }, [type, episodes, selectedEpisode]);

  if (loading || !media) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <Balatro
          color1="#667eea"
          color2="#764ba2"
          color3="#0f0c29"
          spinSpeed={5}
          isRotate={false}
          mouseInteraction={true}
          pixelFilter={10000}
        />
        <div className="relative z-10 glass p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const title = tmdbService.getTitle(media);
  const year = tmdbService.getYear(media);
  const posterUrl = tmdbService.getPosterUrl(media.poster_path);
  const currentEpisode = episodes.find(e => e.episode_number === selectedEpisode);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <Balatro
        color1="#667eea"
        color2="#764ba2"
        color3="#0f0c29"
        spinSpeed={5}
        isRotate={false}
        mouseInteraction={true}
        pixelFilter={10000}
      />

      <div className="relative z-10 min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/');
          }}
          className="mb-4 inline-flex items-center gap-2 glass glass-hover px-4 py-2 rounded-full w-fit transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex-1 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Media Info */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full rounded-xl shadow-2xl"
                />

                <div className="space-y-2">
                  <h1 className="text-2xl font-display font-bold text-white">{title}</h1>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
                    <span>{type === 'movie' ? 'Movie' : 'TV Show'}</span>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </div>

                  {media.vote_average > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-semibold">{media.vote_average.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">/ 10</span>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {media.overview}
                  </p>
                </div>
              </div>

              {/* Season Selector for TV Shows */}
              {type === 'tv' && 'seasons' in media && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Seasons</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {media.seasons
                      .filter(s => s.season_number > 0)
                      .map((season) => (
                        <button
                          key={season.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSeason(season.season_number);
                            setSelectedEpisode(1);
                          }}
                          className={cn(
                            "px-4 py-2 rounded-lg glass glass-hover transition-all duration-300",
                            selectedSeason === season.season_number && "bg-primary/30 border-primary/50"
                          )}
                        >
                          S{season.season_number}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Player */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {streamUrl ? (
                    <iframe
                      key={streamUrl}
                      src={streamUrl}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  )}

                  {/* Episode Navigation for TV Shows */}
                  {type === 'tv' && episodes.length > 0 && (
                    <>
                      {episodes.findIndex(e => e.episode_number === selectedEpisode) > 0 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEpisodeChange('prev');
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 glass glass-hover p-3 rounded-full hover:scale-110 transition-all duration-300"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                      )}
                      {episodes.findIndex(e => e.episode_number === selectedEpisode) < episodes.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEpisodeChange('next');
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 glass glass-hover p-3 rounded-full hover:scale-110 transition-all duration-300"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Player Controls */}
                <div className="p-4 space-y-4">
                  {currentEpisode && (
                    <div>
                      <h3 className="font-semibold text-white">
                        Episode {currentEpisode.episode_number}: {currentEpisode.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentEpisode.overview}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Episodes List for TV Shows */}
              {type === 'tv' && episodes.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowEpisodeList(!showEpisodeList);
                    }}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="font-semibold text-white">Episodes ({episodes.length})</h3>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        showEpisodeList && "rotate-90"
                      )}
                    />
                  </button>

                  {showEpisodeList && (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {episodes.map((episode) => (
                        <button
                          key={episode.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedEpisode(episode.episode_number);
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-lg glass glass-hover transition-all duration-300",
                            selectedEpisode === episode.episode_number && "bg-primary/30 border-primary/50"
                          )}
                        >
                          <div className="font-medium text-white">
                            Episode {episode.episode_number}: {episode.name}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {episode.overview}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
