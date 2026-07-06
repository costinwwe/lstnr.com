const SPOTIFY_API = 'https://api.spotify.com/v1';

async function spotifyGet(token, path) {
  const response = await fetch(`${SPOTIFY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return response.json();
}

function mapTopArtists(items = [], limit = 10) {
  return items.slice(0, limit).map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url || null,
    subtitle: 'Artist',
    popularity: artist.popularity ?? 0,
  }));
}

function mapTopTracks(items = [], limit = 10) {
  return items.slice(0, limit).map((item) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    coverUrl: item.album?.images?.[0]?.url || null,
  }));
}

function mapAlbumsFromTracks(items = [], limit = 8) {
  const albums = new Map();

  items.forEach((track) => {
    const album = track.album;
    if (!album || albums.has(album.id)) return;

    albums.set(album.id, {
      id: album.id,
      title: album.name,
      artist: album.artists.map((a) => a.name).join(', '),
      coverUrl: album.images?.[0]?.url || null,
    });
  });

  return Array.from(albums.values()).slice(0, limit);
}

function mapPublicPlaylists(items = []) {
  return items
    .filter((playlist) => playlist.public)
    .slice(0, 12)
    .map((playlist) => ({
      id: playlist.id,
      title: playlist.name,
      subtitle: playlist.owner?.display_name ? `By ${playlist.owner.display_name}` : 'Playlist',
      coverUrl: playlist.images?.[0]?.url || null,
      trackCount: playlist.tracks?.total || 0,
      url: playlist.external_urls?.spotify || null,
    }));
}

function mapFollowingArtists(items = []) {
  return items.slice(0, 12).map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url || null,
    subtitle: 'Artist',
  }));
}

function mapRecentlyPlayed(items = [], limit = 10) {
  return items.slice(0, limit).map((item) => ({
    id: `${item.track.id}-${item.played_at}`,
    title: item.track.name,
    artist: item.track.artists.map((a) => a.name).join(', '),
    coverUrl: item.track.album?.images?.[0]?.url || null,
    playedAt: item.played_at,
  }));
}

function buildActivityLevels(recentItems = []) {
  const activityLevels = new Array(90).fill(0);
  const today = new Date();

  recentItems.forEach((item) => {
    const playedDate = new Date(item.played_at);
    const diffDays = Math.floor(Math.abs(today - playedDate) / (1000 * 60 * 60 * 24));

    if (diffDays < 90) {
      const targetIndex = 89 - diffDays;
      activityLevels[targetIndex] = Math.min(4, activityLevels[targetIndex] + 1);
    }
  });

  return activityLevels;
}

function extractTopGenres(artists = [], limit = 6) {
  const genreCounts = artists
    .flatMap((artist) => artist.genres || [])
    .filter(Boolean)
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

  return Object.keys(genreCounts)
    .sort((a, b) => genreCounts[b] - genreCounts[a])
    .slice(0, limit)
    .map((genre) => genre.charAt(0).toUpperCase() + genre.slice(1));
}

export async function syncSpotifyProfile(token) {
  const [
    me,
    topArtistsShort,
    topArtistsMedium,
    topTracks,
    recentlyPlayed,
    playlists,
    followingArtists,
  ] = await Promise.all([
    spotifyGet(token, '/me'),
    spotifyGet(token, '/me/top/artists?limit=10&time_range=short_term'),
    spotifyGet(token, '/me/top/artists?limit=10&time_range=medium_term'),
    spotifyGet(token, '/me/top/tracks?limit=10&time_range=medium_term'),
    spotifyGet(token, '/me/player/recently-played?limit=50'),
    spotifyGet(token, '/me/playlists?limit=50'),
    spotifyGet(token, '/me/following?type=artist&limit=12'),
  ]);

  if (!me) {
    throw new Error('Could not load Spotify profile.');
  }

  const artistsThisMonth = mapTopArtists(topArtistsShort?.items || [], 10);
  const artistsAllTime = mapTopArtists(topArtistsMedium?.items || [], 5);
  const tracks = mapTopTracks(topTracks?.items || [], 10);
  const albums = mapAlbumsFromTracks(topTracks?.items || [], 8);
  const publicPlaylists = mapPublicPlaylists(playlists?.items || []);
  const following = mapFollowingArtists(followingArtists?.artists?.items || []);
  const recentTracks = mapRecentlyPlayed(recentlyPlayed?.items || [], 10);
  const activity = buildActivityLevels(recentlyPlayed?.items || []);
  const genres = extractTopGenres([
    ...(topArtistsShort?.items || []),
    ...(topArtistsMedium?.items || []),
  ]);

  const isPremium = me.product === 'premium';

  return {
    fullName: me.display_name || me.id,
    avatarUrl: me.images?.[0]?.url || null,
    bannerUrl: null,
    bio: isPremium ? '👑 Spotify Premium Member' : '🎵 Music Enthusiast',
    pronouns: 'They/Them',
    links: me.external_urls?.spotify
      ? [{ title: 'Spotify', url: me.external_urls.spotify }]
      : [],
    badges: [
      ...(isPremium ? [{ icon: '👑', name: 'Premium' }] : []),
      { icon: '🎧', name: 'Top Listener' },
      { icon: '🔥', name: 'Active' },
    ],
    stats: {
      public_playlists: publicPlaylists.length,
      following: followingArtists?.artists?.total || following.length,
      followers: me.followers?.total || 0,
    },
    favorites: {
      tracks,
      albums,
      artists: artistsThisMonth.length ? artistsThisMonth : artistsAllTime,
      genres,
      playlists: publicPlaylists,
      following,
    },
    recentlyPlayed: recentTracks,
    currentlyPlaying: null,
    activity,
    musicPersonality: null,
  };
}
