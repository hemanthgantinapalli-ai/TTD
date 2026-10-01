import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DevotionalMusicFab.module.css';
import devotionalAudioSrc from '../../../assets/audio/devotional-music.mp3';

/* ── SVG Icons ───────────────────────────────────────────── */
const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const PauseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const Volume2Icon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const VolumeXIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

/* 
 * Global Audio Singleton
 * Ensures seamless infinite playback ("unlimitedly") without duplicate tracks
 */
let sharedAudioInstance = null;

function getSharedAudio() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioInstance) {
    const src = devotionalAudioSrc || '/audio/devotional-music.mp3';
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.75;

    // Fallback if bundled asset path ever needs static fallback
    audio.addEventListener('error', () => {
      if (!audio.src.endsWith('/audio/devotional-music.mp3')) {
        audio.src = '/audio/devotional-music.mp3';
        audio.load();
        audio.play().catch(() => {});
      }
    });

    // Guaranteed infinite continuous loop ("unlimitedly")
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    sharedAudioInstance = audio;
  }
  return sharedAudioInstance;
}

const DevotionalMusicFab = () => {
  const containerRef = useRef(null);
  const userPausedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);

  /* 
   * Stop ALL audio instances immediately when devotee clicks Pause
   */
  const stopAllAudio = useCallback(() => {
    userPausedRef.current = true;

    // 1. Pause shared singleton
    if (sharedAudioInstance) {
      try {
        sharedAudioInstance.pause();
      } catch (_) {}
    }

    // 2. Pause any other potential audio elements
    if (typeof document !== 'undefined') {
      document.querySelectorAll('audio').forEach((el) => {
        try {
          el.pause();
        } catch (_) {}
      });
    }

    setIsPlaying(false);
  }, []);

  /* 
   * 1. Bind listeners to shared audio instance & sync state
   */
  useEffect(() => {
    const audio = getSharedAudio();
    if (!audio) return;

    // Initial state sync
    setIsPlaying(!audio.paused);
    setIsMuted(audio.muted);
    setVolume(audio.volume);

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setIsMuted(audio.muted);
      setVolume(audio.volume);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('volumechange', onVolumeChange);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('volumechange', onVolumeChange);
    };
  }, []);

  /* 
   * 2. Automatic song playback on visit + infinite continuous loop ("unlimitedly")
   */
  useEffect(() => {
    const audio = getSharedAudio();
    if (!audio) return;

    // Reset userPaused on visit so the devotional song automatically plays
    userPausedRef.current = false;
    audio.loop = true;
    audio.volume = volume;

    // Immediate attempt to play audio with sound
    const startAudio = async () => {
      try {
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (err) {
        // Browser requires initial user gesture for unmuted sound -> start playing muted immediately
        try {
          audio.muted = true;
          await audio.play();
          setIsPlaying(true);
          setIsMuted(true);
        } catch (_) {}
      }
    };

    startAudio();

    // Devotee first gesture anywhere on the site (scroll, click, touch): immediately unmute sound
    const handleGesture = (e) => {
      // If user clicked inside the widget itself, do not interfere with controls
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }

      removeGestureListeners();

      if (userPausedRef.current) return;

      const currentAudio = getSharedAudio();
      if (currentAudio && !userPausedRef.current) {
        currentAudio.muted = false;
        currentAudio.volume = volume > 0 ? volume : 0.75;
        if (currentAudio.paused) {
          currentAudio.play().catch(() => {});
        }
        setIsMuted(false);
        setIsPlaying(true);
      }
    };

    const events = ['click', 'pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'];
    const removeGestureListeners = () => {
      events.forEach((ev) => window.removeEventListener(ev, handleGesture, true));
    };

    events.forEach((ev) => window.addEventListener(ev, handleGesture, true));

    return () => {
      removeGestureListeners();
    };
  }, [volume]);

  /* 
   * 3. Toggle Play / Pause: guaranteed immediate pause or resume
   */
  const togglePlay = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();

    const audio = getSharedAudio();
    if (!audio) return;

    if (!audio.paused) {
      // Audio is playing -> STOP IT
      stopAllAudio();
    } else {
      // Audio is paused -> START IT (infinite loop)
      userPausedRef.current = false;
      audio.muted = false;
      setIsMuted(false);
      audio.volume = volume > 0 ? volume : 0.75;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  }, [volume, stopAllAudio]);

  /* 
   * 4. Toggle Mute / Unmute
   */
  const toggleMute = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();

    const audio = getSharedAudio();
    if (!audio) return;

    if (audio.muted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, []);

  /* 
   * 5. Volume Change
   */
  const handleVolumeChange = useCallback((e) => {
    e?.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);

    const audio = getSharedAudio();
    if (audio) {
      audio.volume = newVol;
      if (newVol > 0 && audio.muted) {
        audio.muted = false;
        setIsMuted(false);
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.smallSlideBar}
      aria-label="Devotional Music Background Player"
    >
      {/* Sleek Slide Bar Pill */}
      <div className={styles.barPill}>
        {/* Controls Drawer (Reveals smoothly on hover) */}
        <div className={styles.slideDrawer}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.songLabel}>Om Namo Venkatesaya</span>
            <span style={{ fontSize: '9.5px', color: '#E3C05C', letterSpacing: '0.4px', fontWeight: 600 }}>
              Sri Venkateswara Suprabhatam
            </span>
          </div>

          {/* Pause / Play Button */}
          <button
            type="button"
            className={`${styles.ctrlBtn} ${isPlaying ? styles.btnPause : styles.btnPlay}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause devotional music' : 'Play devotional music'}
            title={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Mute Button */}
          <button
            type="button"
            className={styles.muteBtn}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
          </button>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            aria-label="Volume slider"
          />
        </div>

        {/* Tab Edge Handle (always visible on screen edge) */}
        <div
          className={styles.tabHandle}
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePlay(e);
            }
          }}
          title={isPlaying ? (isMuted ? 'Music Playing (Muted) • Click to Unmute' : 'Music Playing • Click to Pause') : 'Music Paused • Click to Play'}
        >
          <span className={styles.omGlyph}>ॐ</span>
          {/* Animated mini sound wave */}
          <div className={`${styles.miniWaves} ${isPlaying && !isMuted ? styles.wavesLive : ''}`}>
            <span className={styles.wave} />
            <span className={styles.wave} />
            <span className={styles.wave} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevotionalMusicFab;
