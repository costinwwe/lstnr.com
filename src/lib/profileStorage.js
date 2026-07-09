import { supabase } from "../supabase";

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
    username: "",
    display_name: "",
    location: "",
    bg_color: "#121212",
    aura_color: "#1DB954",
    bio: "",
    pronouns: "They/Them",
    bannerUrl: null,
    avatarUrl: null,
    links: [],
    badges: [],
    activity: null,
    musicPersonality: null,
    created_at: null,
  },
  stats: { public_playlists: 0, following: 0, followers: 0 },
  favorites: EMPTY_FAVORITES,
  recentlyPlayed: [],
  currentlyPlaying: null,
  fullName: null,
};

export async function loadPublicProfile(profileId) {
  if (!profileId) return null;

  // MAGIA AICI: Verificăm dacă ce e în link arată a ID de Supabase (UUID)
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      profileId,
    );

  if (isUUID) {
    // Dacă e UUID, căutăm după id
    const { data: byId } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();

    if (byId) return byId;

    // Dacă nu a găsit după id, încercăm după user_id
    const { data: byUserId } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", profileId)
      .maybeSingle();

    if (byUserId) return byUserId;
  }

  // Dacă nu e UUID (adică e "Ajutor444" sau alt username pus de tine), căutăm glonț după username!
  const { data: byUsername } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", profileId)
    .maybeSingle();

  if (byUsername) return byUsername;

  return null;
}

export function mapSavedProfileToState(savedProfile) {
  if (!savedProfile) return EMPTY_PROFILE_STATE;

  const savedPayload = savedProfile.profile_data || {};

  return {
    fullName: savedProfile.full_name || savedProfile.display_name || null,
    profileData: {
      username: savedProfile.username || "",
      display_name: savedProfile.display_name || "",
      location: savedProfile.location || "",
      bg_color: savedProfile.bg_color || "#121212",
      aura_color: savedProfile.aura_color || "#1DB954",
      bio: savedProfile.bio || savedPayload.bio || "",
      pronouns: savedProfile.pronouns || savedPayload.pronouns || "They/Them",
      bannerUrl: savedProfile.banner_url || savedPayload.bannerUrl || null,
      avatarUrl: savedProfile.avatar_url || savedPayload.avatarUrl || null,
      links: savedProfile.profile_links || savedPayload.links || [],
      badges: savedPayload.badges || [],
      activity: savedPayload.activity || null,
      musicPersonality: savedPayload.musicPersonality || null,
      created_at: savedProfile.created_at || null,
    },
    stats: savedProfile.stats || EMPTY_PROFILE_STATE.stats,
    favorites: savedProfile.favorites || EMPTY_FAVORITES,
    recentlyPlayed: savedProfile.recently_played || [],
    currentlyPlaying: savedProfile.currently_playing || null,
  };
}

export async function savePublicProfile(targetUserId, payload) {
  if (!targetUserId) return { error: new Error("Missing profile id") };

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", targetUserId)
    .single();

  const profileRow = {
    id: targetUserId,
    user_id: targetUserId,
    full_name: existing?.full_name || payload.fullName || null,
    bio: existing?.bio || payload.bio || null,
    pronouns: existing?.pronouns || payload.pronouns || null,
    avatar_url: payload.avatarUrl || existing?.avatar_url || null,
    banner_url: existing?.banner_url || payload.bannerUrl || null,
    profile_links: existing?.profile_links || payload.links || [],
    profile_data: {
      avatarUrl: payload.avatarUrl || null,
      bio: existing?.bio || payload.bio || null,
      pronouns: existing?.pronouns || payload.pronouns || null,
      links: existing?.profile_links || payload.links || [],
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

  const { error } = await supabase
    .from("profiles")
    .upsert(profileRow, { onConflict: "id" });
  return { error };
}
