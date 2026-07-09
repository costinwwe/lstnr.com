import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import {
  EMPTY_PROFILE_STATE,
  loadPublicProfile,
  mapSavedProfileToState,
  savePublicProfile,
} from '../lib/profileStorage';
import { syncSpotifyProfile } from '../lib/spotifySync';
import ProfileHeader from '../components/ProfileHeader';
import StatsRow from '../components/StatsRow';
import { GridSection, TrackList } from '../components/GridSection';
import AlbumGrid from '../components/AlbumGrid';
import SpotifyCarousel from '../components/SpotifyCarousel';
import MiniPlayer from '../components/MiniPlayer';
import ActivityGraph from '../components/ActivityGraph';
import { FavouriteGenres, MusicPersonality, AchievementBadges } from '../components/MusicIdentity';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [sessionUser, setSessionUser] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [profileData, setProfileData] = useState(EMPTY_PROFILE_STATE.profileData);
  const [stats, setStats] = useState(EMPTY_PROFILE_STATE.stats);
  const [favorites, setFavorites] = useState(EMPTY_PROFILE_STATE.favorites);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const applyProfileState = (mapped, profileId, ownerView) => {
    setProfileData(mapped.profileData);
    setStats(mapped.stats);
    setFavorites(mapped.favorites);
    setRecentlyPlayed(mapped.recentlyPlayed);
    setCurrentlyPlaying(mapped.currentlyPlaying);
    setViewedUser({ id: profileId, user_metadata: { full_name: mapped.fullName || `User ${profileId.slice(0, 8)}` }});
    setProfileNotFound(false);
    setIsOwner(ownerView);
  };

  useEffect(() => {
    let cancelled = false;
    let pingInterval;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const activeUser = session?.user ?? null;
        const profileId = uid || activeUser?.id;

        if (!profileId) { navigate('/login'); return; }
        if (!uid && activeUser?.id) { navigate(`/profile/${activeUser.id}`, { replace: true }); return; }
        if (cancelled) return;

        setSessionUser(activeUser);
        const ownerView = activeUser?.id === profileId;

        const savedProfile = await loadPublicProfile(profileId);
        let mappedSaved = null;

        if (savedProfile) {
          mappedSaved = mapSavedProfileToState(savedProfile);
          applyProfileState(mappedSaved, profileId, ownerView);
        } else if (!ownerView) {
          setProfileNotFound(true); setLoading(false); return;
        }

        // DACA ESTI PROPRIETARUL: Face sync și setează PING-UL la 10 secunde!
        if (ownerView && session?.provider_token) {
          try {
            const synced = await syncSpotifyProfile(session.provider_token);
            if (cancelled) return;

            const mergedProfileData = mappedSaved ? {
              ...mappedSaved.profileData,
              avatarUrl: synced.avatarUrl || mappedSaved.profileData.avatarUrl,
              activity: synced.activity, badges: synced.badges,
            } : {
              bio: synced.bio, pronouns: synced.pronouns, bannerUrl: synced.bannerUrl,
              avatarUrl: synced.avatarUrl, links: synced.links, badges: synced.badges,
              activity: synced.activity, musicPersonality: synced.musicPersonality,
            };

            applyProfileState({
              fullName: mappedSaved?.fullName || synced.fullName,
              profileData: mergedProfileData,
              stats: synced.stats, favorites: synced.favorites,
              recentlyPlayed: synced.recentlyPlayed, currentlyPlaying: synced.currentlyPlaying,
            }, profileId, true);

            await savePublicProfile(profileId, synced);

            // REAL-TIME PING pentru MiniPlayer (doar owner-ul face asta spre Supabase)
            pingInterval = setInterval(async () => {
              try {
                const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                  headers: { Authorization: `Bearer ${session.provider_token}` }
                });
                let current = null;
                if (res.status === 200) {
                  const data = await res.json();
                  if (data.is_playing && data.item) {
                    current = {
                      title: data.item.name, artist: data.item.artists.map(a => a.name).join(", "),
                      album: data.item.album.name, coverUrl: data.item.album.images?.[0]?.url || null,
                      progress: data.progress_ms, duration: data.item.duration_ms,
                    };
                  }
                }
                setCurrentlyPlaying(current);
                // Dăm update doar la currently_playing în baza de date ca să vadă și vizitatorii!
                await supabase.from('profiles').update({ currently_playing: current }).eq('id', profileId);
              } catch(err) { console.error("Interval ping error", err); }
            }, 10000);

          } catch (error) { console.error('Spotify sync failed:', error); }
        }
      } catch (error) {
        if (!cancelled) setProfileNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [uid, navigate]);

  if (loading) return <div className="profile-page"><p>Loading profile...</p></div>;
  if (profileNotFound) return (<div className="profile-page profile-empty"><h1>Profile not published yet</h1></div>);

  const profileTargetId = uid || sessionUser?.id;
  const userName = viewedUser?.user_metadata?.full_name || viewedUser?.full_name || `User`;

  const handleShare = async () => {
    const identifier = profileData.username || profileTargetId;
    const shareUrl = `${window.location.origin}/profile/${identifier}`;
    if (navigator.share) { await navigator.share({ title: `${userName} on lstnr`, text: 'Check out my Spotify profile', url: shareUrl }); return; }
    await navigator.clipboard.writeText(shareUrl); alert('Profile link copied!');
  };

  return (
    <main className="profile-page" style={{ backgroundColor: profileData.bg_color || 'var(--bg-main)', '--accent': profileData.aura_color || 'var(--text-primary)', boxShadow: `inset 0 0 150px ${profileData.aura_color}20` }}>
      <Helmet><title>{userName} | lstnr</title></Helmet>
      
      <ProfileHeader
        user={viewedUser || sessionUser} userName={userName}
        profileData={profileData} setProfileData={setProfileData}
        handleShare={handleShare} isOwner={isOwner} stats={stats}
      />
      <StatsRow stats={stats} />
      
      <GridSection title="Top artists this month"><SpotifyCarousel items={favorites.artists} variant="circle" /></GridSection>
      <GridSection title="Public Playlists" badgeCount={favorites.playlists?.length || 0}><SpotifyCarousel items={favorites.playlists} variant="square" /></GridSection>

      <div className="split-grid">
        <GridSection title="Favourite Tracks" badgeCount={favorites.tracks.length}><TrackList tracks={favorites.tracks} /></GridSection>
        <GridSection title="Favourite Albums" badgeCount={favorites.albums.length}><AlbumGrid albums={favorites.albums} /></GridSection>
      </div>

      <div className="split-grid">
        <GridSection title="Recently Played"><TrackList tracks={recentlyPlayed} showTime emptyMsg="No recent activity." /></GridSection>
        <GridSection title="Listening Activity"><ActivityGraph data={profileData.activity} /></GridSection>
      </div>

      <GridSection title="Music Personality & Genres">
        <MusicPersonality personality={profileData.musicPersonality || null} />
        <h3 className="profile-subheading">Favourite Genres</h3>
        <FavouriteGenres genres={favorites.genres} />
        <h3 className="profile-subheading spaced">Badges</h3>
        <AchievementBadges badges={profileData.badges || []} />
      </GridSection>

      <MiniPlayer currentlyPlaying={currentlyPlaying} />
    </main>
  );
};
export default Profile;