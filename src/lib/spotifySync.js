const SPOTIFY_API = "https://api.spotify.com/v1";

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
    subtitle: "Artist",
    popularity: artist.popularity ?? 0,
    genres: artist.genres || [], // Păstrăm genurile aici
  }));
}

function mapTopTracks(items = [], limit = 10) {
  return items.slice(0, limit).map((item) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
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
      artist: album.artists.map((a) => a.name).join(", "),
      coverUrl: album.images?.[0]?.url || null,
    });
  });
  return Array.from(albums.values()).slice(0, limit);
}

function mapPublicPlaylists(items = []) {
  return items.map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: `${p.tracks.total} tracks`,
    coverUrl: p.images?.[0]?.url || null,
    url: p.external_urls.spotify,
  }));
}

function mapFollowingArtists(items = []) {
  return items.map((a) => ({
    id: a.id,
    name: a.name,
    imageUrl: a.images?.[0]?.url || null,
    url: a.external_urls.spotify,
  }));
}

function mapRecentlyPlayed(items = [], limit = 10) {
  return items.slice(0, limit).map((item) => ({
    id: item.track.id,
    title: item.track.name,
    artist: item.track.artists.map((a) => a.name).join(", "),
    coverUrl: item.track.album?.images?.[0]?.url || null,
    playedAt: item.played_at,
  }));
}

function buildActivityLevels(items = []) {
  const activity = new Array(90).fill(0);
  items.forEach((item) => {
    const date = new Date(item.played_at);
    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff < 90) activity[89 - diff] = Math.min(activity[89 - diff] + 1, 4);
  });
  return activity;
}

// LOGICA NOUĂ: Extrage top genuri din artiști
function extractTopGenres(artists) {
  const genreCounts = {};
  artists.forEach((artist) => {
    if (artist.genres && artist.genres.length > 0) {
      artist.genres.forEach((genre) => {
        const cleanGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
        genreCounts[cleanGenre] = (genreCounts[cleanGenre] || 0) + 1;
      });
    }
  });
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])
    .slice(0, 10);
}

export async function syncSpotifyProfile(token) {
  const [
    me,
    topTracks,
    topArtistsMedium,
    playlists,
    followingArtists,
    recentlyPlayed,
  ] = await Promise.all([
    spotifyGet(token, "/me"),
    spotifyGet(token, "/me/top/tracks?limit=20&time_range=short_term"),
    spotifyGet(token, "/me/top/artists?limit=50&time_range=medium_term"),
    spotifyGet(token, "/me/playlists"),
    spotifyGet(token, "/me/following?type=artist"),
    spotifyGet(token, "/me/player/recently-played?limit=20"),
  ]);

  if (!me) return null;

  const tracks = mapTopTracks(topTracks?.items || [], 8);
  const albums = mapAlbumsFromTracks(topTracks?.items || [], 8);
  const publicPlaylists = mapPublicPlaylists(playlists?.items || []);
  const following = mapFollowingArtists(followingArtists?.artists?.items || []);
  const recentTracks = mapRecentlyPlayed(recentlyPlayed?.items || [], 10);
  const activity = buildActivityLevels(recentlyPlayed?.items || []);

  // Aici calculăm genurile
  const genres = extractTopGenres(topArtistsMedium?.items || []);

  const isPremium = me.product === "premium";

  return {
    fullName: me.display_name || me.id,
    avatarUrl: me.images?.[0]?.url || null,
    bio: isPremium ? "👑 Spotify Premium Member" : "🎵 Music Enthusiast",
    pronouns: "They/Them",
    links: me.external_urls?.spotify
      ? [{ title: "Spotify", url: me.external_urls.spotify }]
      : [],
    badges: [
      ...(isPremium ? [{ icon: "👑", name: "Premium" }] : []),
      { icon: "🎧", name: "Top Listener" },
      { icon: "🔥", name: "Active" },
    ],
    stats: {
      public_playlists: publicPlaylists.length,
      following: followingArtists?.artists?.total || following.length,
      followers: me.followers?.total || 0,
    },
    favorites: {
      tracks,
      albums,
      artists: mapTopArtists(topArtistsMedium?.items || [], 8),
      genres, // Acum sunt incluse!
      playlists: publicPlaylists,
      following,
    },
    recentlyPlayed: recentTracks,
    activity,
  };
}
