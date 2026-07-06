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
  const [syncError, setSyncError] = useState('');

  const applyProfileState = (mapped, profileId, ownerView) => {
    setProfileData(mapped.profileData);
    setStats(mapped.stats);
    setFavorites(mapped.favorites);
    setRecentlyPlayed(mapped.recentlyPlayed);
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

        if (savedProfile) {
          applyProfileState(mapSavedProfileToState(savedProfile), profileId, ownerView);
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

            applyProfileState(
              {
                fullName: synced.fullName,
                profileData: {
                  bio: synced.bio,
                  pronouns: synced.pronouns,
                  bannerUrl: synced.bannerUrl,
                  avatarUrl: synced.avatarUrl,
                  links: synced.links,
                  badges: synced.badges,
                  activity: synced.activity,
                  musicPersonality: synced.musicPersonality,
                },
                stats: synced.stats,
                favorites: synced.favorites,
                recentlyPlayed: synced.recentlyPlayed,
                currentlyPlaying: synced.currentlyPlaying,
              },
              profileId,
              true,
            );

            const { error } = await savePublicProfile(profileId, synced);
            if (error) {
              console.warn('Supabase save error:', error);
              setSyncError('Profile loaded from Spotify, but could not publish it yet. Check Supabase RLS policies.');
            }
          } catch (error) {
            console.error('Spotify sync failed:', error);
            if (!savedProfile) {
              setProfileNotFound(true);
            } else {
              setSyncError('Could not refresh from Spotify. Showing last saved public profile.');
            }
          }
        } else if (ownerView && !session?.provider_token) {
          setSyncError('Sign in with Spotify to sync and publish your public profile.');
        }
      } catch (error) {
        console.error('Profile load failed:', error);
        if (!cancelled) {
          setProfileNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);

      const profileId = uid || session?.user?.id;
      const ownerView = session?.user?.id === profileId;

      if (ownerView && session?.provider_token) {
        setSpotifyToken(session.provider_token);
      } else {
        setSpotifyToken(null);
      }
    });

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [uid, navigate]);

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (profileNotFound) {
    return (
      <div className="profile-page profile-empty">
        <h1>Profile not published yet</h1>
        <p>This user has not synced their Spotify profile to lstnr yet.</p>
        {sessionUser?.id === uid ? (
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>
            Sign in with Spotify to publish
          </button>
        ) : null}
      </div>
    );
  }

  const profileTargetId = uid || sessionUser?.id;
  const userName =
    viewedUser?.user_metadata?.full_name ||
    viewedUser?.full_name ||
    `User ${profileTargetId?.slice(0, 8)}`;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${profileTargetId}`;
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
    <main className="profile-page">
      <Helmet>
        <title>{userName} | lstnr</title>
        <meta property="og:title" content={`${userName}'s Spotify Profile`} />
        <meta property="og:description" content="Top artists, playlists, and music taste." />
        <meta property="og:image" content={profileData.avatarUrl} />
        <meta property="og:url" content={window.location.href} />
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

      <GridSection title="Top artists this month" subtitle="Synced from Spotify">
        <SpotifyCarousel
          items={favorites.artists}
          variant="circle"
          emptyMsg="No top artists yet."
        />
      </GridSection>

      <GridSection title="Public Playlists" badgeCount={favorites.playlists?.length || 0}>
        <SpotifyCarousel
          items={favorites.playlists}
          variant="square"
          emptyMsg="No public playlists yet."
        />
      </GridSection>

      <GridSection title="Following" badgeCount={favorites.following?.length || 0}>
        <SpotifyCarousel
          items={favorites.following}
          variant="circle"
          emptyMsg="No followed artists yet."
        />
      </GridSection>

      <div className="split-grid">
        <GridSection title="Favourite Tracks" badgeCount={favorites.tracks.length}>
          <TrackList tracks={favorites.tracks} emptyMsg="No favourite tracks yet." />
        </GridSection>

        <GridSection title="Favourite Albums" badgeCount={favorites.albums.length}>
          <AlbumGrid albums={favorites.albums} emptyMsg="No favourite albums yet." />
        </GridSection>
      </div>

      <div className="split-grid">
        <GridSection title="Recently Played">
          <TrackList tracks={recentlyPlayed} showTime emptyMsg="No recent activity." />
        </GridSection>

        <GridSection title="Listening Activity">
          <ActivityGraph data={profileData.activity} />
        </GridSection>
      </div>

      <GridSection title="Music Personality & Genres">
        <MusicPersonality personality={profileData.musicPersonality || null} />
        <h3 className="profile-subheading">Favourite Genres</h3>
        <FavouriteGenres genres={favorites.genres} />
        <h3 className="profile-subheading spaced">Badges</h3>
        <AchievementBadges badges={profileData.badges || []} />
      </GridSection>

      {isOwner ? <MiniPlayer spotifyAccessToken={spotifyToken} /> : null}
    </main>
  );
};

export default Profile;
