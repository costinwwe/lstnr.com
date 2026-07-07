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
import ArtistList from '../components/ArtistList';
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
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [profileData, setProfileData] = useState(EMPTY_PROFILE_STATE.profileData);
  const [stats, setStats] = useState(EMPTY_PROFILE_STATE.stats);
  const [favorites, setFavorites] = useState(EMPTY_PROFILE_STATE.favorites);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Adăugat starea asta
  const [syncError, setSyncError] = useState('');

  const applyProfileState = (mapped, profileId, ownerView) => {
    setProfileData(mapped.profileData);
    setStats(mapped.stats);
    setFavorites(mapped.favorites);
    setRecentlyPlayed(mapped.recentlyPlayed);
    setCurrentlyPlaying(mapped.currentlyPlaying); // Sincronizăm și asta
    setViewedUser({
      id: profileId,
      user_metadata: {
        full_name: mapped.fullName || `User ${profileId.slice(0, 8)}`,
      },
    });
    setProfileNotFound(false);
    setIsOwner(ownerView);
  };

  const resetProfileState = () => {
    setProfileData(EMPTY_PROFILE_STATE.profileData);
    setStats(EMPTY_PROFILE_STATE.stats);
    setFavorites(EMPTY_PROFILE_STATE.favorites);
    setRecentlyPlayed([]);
    setCurrentlyPlaying(null);
    setViewedUser(null);
    setProfileNotFound(false);
    setSyncError('');
    setSpotifyToken(null);
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      resetProfileState();
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const activeUser = session?.user ?? null;
        const profileId = uid || activeUser?.id;

        if (!profileId) {
          navigate('/login');
          return;
        }

        if (!uid && activeUser?.id) {
          navigate(`/profile/${activeUser.id}`, { replace: true });
          return;
        }

        if (cancelled) return;

        setSessionUser(activeUser);
        const ownerView = activeUser?.id === profileId;
        setIsOwner(ownerView);

        const savedProfile = await loadPublicProfile(profileId);
        let mappedSaved = null;

        if (savedProfile) {
          mappedSaved = mapSavedProfileToState(savedProfile);
          applyProfileState(mappedSaved, profileId, ownerView);
        } else if (!ownerView) {
          setProfileNotFound(true);
          setLoading(false);
          return;
        }

        if (ownerView && session?.provider_token) {
          setSpotifyToken(session.provider_token);

          try {
            const synced = await syncSpotifyProfile(session.provider_token);
            if (cancelled) return;

            const mergedProfileData = mappedSaved ? {
              ...mappedSaved.profileData,
              avatarUrl: synced.avatarUrl || mappedSaved.profileData.avatarUrl,
              activity: synced.activity,
              badges: synced.badges,
            } : {
              bio: synced.bio,
              pronouns: synced.pronouns,
              bannerUrl: synced.bannerUrl,
              avatarUrl: synced.avatarUrl,
              links: synced.links,
              badges: synced.badges,
              activity: synced.activity,
              musicPersonality: synced.musicPersonality,
            };

            applyProfileState(
              {
                fullName: mappedSaved?.fullName || synced.fullName,
                profileData: mergedProfileData,
                stats: synced.stats,
                favorites: synced.favorites,
                recentlyPlayed: synced.recentlyPlayed,
                currentlyPlaying: synced.currentlyPlaying,
              },
              profileId,
              true,
            );

            await savePublicProfile(profileId, synced);
          } catch (error) {
            console.error('Spotify sync failed:', error);
          }
        }
      } catch (error) {
        console.error('Profile load failed:', error);
        if (!cancelled) setProfileNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [uid, navigate]);

  if (loading) return <div className="profile-page"><p>Loading profile...</p></div>;

  if (profileNotFound) {
    return (
      <div className="profile-page profile-empty">
        <h1>Profile not published yet</h1>
        <p>This user has not synced their Spotify profile to lstnr yet.</p>
      </div>
    );
  }

  const profileTargetId = uid || sessionUser?.id;
  const userName = viewedUser?.user_metadata?.full_name || viewedUser?.full_name || `User ${profileTargetId?.slice(0, 8)}`;

  const handleShare = async () => {
    const identifier = profileData.username || profileTargetId;
    const shareUrl = `${window.location.origin}/profile/${identifier}`;
    
    const shareData = {
      title: `${userName} on lstnr`,
      text: 'Check out my Spotify profile',
      url: shareUrl,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    alert('Profile link copied!');
  };

  return (
    <main 
      className="profile-page" 
      style={{ 
        backgroundColor: profileData.bg_color || 'var(--bg-main)', 
        '--accent': profileData.aura_color || 'var(--text-primary)', 
        boxShadow: `inset 0 0 150px ${profileData.aura_color}20` 
      }}
    >
      <Helmet>
        <title>{userName} | lstnr</title>
      </Helmet>

      {syncError ? <div className="profile-sync-banner">{syncError}</div> : null}

      <ProfileHeader
        user={viewedUser || sessionUser}
        userName={userName}
        profileData={profileData}
        setProfileData={setProfileData}
        handleShare={handleShare}
        isOwner={isOwner}
        stats={stats}
      />

      <StatsRow stats={stats} />

      <GridSection title="Top artists this month">
        <SpotifyCarousel items={favorites.artists} variant="circle" />
      </GridSection>

      <GridSection title="Public Playlists" badgeCount={favorites.playlists?.length || 0}>
        <SpotifyCarousel items={favorites.playlists} variant="square" />
      </GridSection>

      <div className="split-grid">
        <GridSection title="Favourite Tracks" badgeCount={favorites.tracks.length}>
          <TrackList tracks={favorites.tracks} />
        </GridSection>
        <GridSection title="Favourite Albums" badgeCount={favorites.albums.length}>
          <AlbumGrid albums={favorites.albums} />
        </GridSection>
      </div>

      <GridSection title="Listening Activity">
        <ActivityGraph data={profileData.activity} />
      </GridSection>

      {/* MiniPlayer primește datele din state-ul local, nu din Spotify direct */}
      <MiniPlayer currentlyPlaying={currentlyPlaying} />
    </main>
  );
};

export default Profile;