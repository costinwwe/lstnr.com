import { supabase } from '../supabase';

const EMPTY_FAVORITES = {
  tracks: [],
  albums: [],
  artists: [],
  genres: [],
  playlists: [],
  following: [],
};

export const EMPTY_PROFILE_STATE = {
  profileData: {
    bio: '',
    pronouns: 'They/Them',
    bannerUrl: null,
    avatarUrl: null,
    links: [],
    badges: [],
    activity: null,
    musicPersonality: null,
  },
  stats: { public_playlists: 0, following: 0, followers: 0 },
  favorites: EMPTY_FAVORITES,
  recentlyPlayed: [],
  currentlyPlaying: null,
  fullName: null,
};

export async function loadPublicProfile(profileId) {
  if (!profileId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (data) return data;

  const { data: byUserId, error: byUserIdError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', profileId)
    .maybeSingle();

  if (byUserIdError && byUserIdError.code !== 'PGRST116') {
    throw byUserIdError;
  }

  return byUserId || null;
}

export function mapSavedProfileToState(savedProfile) {
  if (!savedProfile) return EMPTY_PROFILE_STATE;

  const savedPayload = savedProfile.profile_data || {};
  const favorites = savedProfile.favorites || EMPTY_FAVORITES;

  return {
    fullName: savedProfile.full_name || savedProfile.display_name || null,
    profileData: {
      bio: savedPayload.bio || savedProfile.bio || '',
      pronouns: savedPayload.pronouns || savedProfile.pronouns || 'They/Them',
      bannerUrl: savedPayload.bannerUrl || savedPayload.banner_url || savedProfile.banner_url || null,
      avatarUrl: savedPayload.avatarUrl || savedPayload.avatar_url || savedProfile.avatar_url || null,
      links: savedPayload.links || savedProfile.profile_links || [],
      badges: savedPayload.badges || [],
      activity: savedPayload.activity || null,
      musicPersonality: savedPayload.musicPersonality || null,
    },
    stats: savedProfile.stats || EMPTY_PROFILE_STATE.stats,
    favorites: {
      tracks: favorites.tracks || [],
      albums: favorites.albums || [],
      artists: favorites.artists || [],
      genres: (favorites.genres || []).filter(Boolean),
      playlists: favorites.playlists || [],
      following: favorites.following || [],
    },
    recentlyPlayed: savedProfile.recently_played || savedProfile.recentlyPlayed || [],
    currentlyPlaying: savedProfile.currently_playing || savedProfile.currentlyPlaying || null,
  };
}

export async function savePublicProfile(targetUserId, payload) {
  if (!targetUserId) return { error: new Error('Missing profile id') };

  const profileRow = {
    id: targetUserId,
    user_id: targetUserId,
    full_name: payload.fullName || null,
    avatar_url: payload.avatarUrl || null,
    banner_url: payload.bannerUrl || null,
    bio: payload.bio || null,
    pronouns: payload.pronouns || null,
    profile_links: payload.links || [],
    profile_data: {
      avatarUrl: payload.avatarUrl || null,
      bannerUrl: payload.bannerUrl || null,
      bio: payload.bio || null,
      pronouns: payload.pronouns || null,
      links: payload.links || [],
      badges: payload.badges || [],
      activity: payload.activity || null,
      musicPersonality: payload.musicPersonality || null,
    },
    stats: payload.stats || null,
    favorites: payload.favorites || null,
    recently_played: payload.recentlyPlayed || [],
    currently_playing: payload.currentlyPlaying || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(profileRow, { onConflict: 'id' });
  return { error };
}
