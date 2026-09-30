import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DevotionalMusicFab.module.css';
import devotionalAudioSrc from '../../../assets/audio/devotional-music.mp3';

const MUSIC_PREF_KEY = 'ttdyatra_devotional_music';

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

const DevotionalMusicFab = () => {
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  /* Robust automatic playback on site open — plays infinitely */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;

    let autoStarted = false;

    // Direct playback attempt
    const triggerAudio = () => {
      if (!audioRef.current || autoStarted) return;
      audioRef.current.muted = false;
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => {
          autoStarted = true;
          setIsPlaying(true);
          removeGestureListeners();
        }).catch(() => {
          // If browser blocked unmuted sound without interaction, start muted initially
          if (audioRef.current && !autoStarted) {
            audioRef.current.muted = true;
            audioRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {});
          }
        });
      }
    };

    // Unmute on ANY user interaction anywhere on the window
    const unmuteOnInteraction = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().then(() => {
          if (!autoStarted) {
            autoStarted = true;
            setIsPlaying(true);
          }
        }).catch(() => {});
      }
      removeGestureListeners();
    };

    const gestureEvents = [
      'pointerdown',
      'mousedown',
      'click',
      'touchstart',
      'touchend',
      'keydown',
      'wheel',
      'scroll',
    ];

    const removeGestureListeners = () => {
      gestureEvents.forEach((ev) =>
        window.removeEventListener(ev, unmuteOnInteraction, { capture: true })
      );
    };

    gestureEvents.forEach((ev) =>
      window.addEventListener(ev, unmuteOnInteraction, { capture: true, once: true })
    );

    // Trigger on mount
    triggerAudio();

    // Trigger once audio data is buffered
    const onReady = () => triggerAudio();
    audio.addEventListener('loadeddata', onReady, { once: true });
    audio.addEventListener('canplay', onReady, { once: true });

    return () => {
      removeGestureListeners();
      audio.removeEventListener('loadeddata', onReady);
      audio.removeEventListener('canplay', onReady);
    };
  }, []);

  /* Hover to pause: automatically pauses when user hovers over the button/bar */
  const handleMouseEnter = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  /* Toggle Play / Pause */
  const togglePlay = useCallback((e) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      try {
        localStorage.setItem(MUSIC_PREF_KEY, 'paused');
      } catch (_) {}
    } else {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlaying(true);
        try {
          localStorage.setItem(MUSIC_PREF_KEY, 'playing');
        } catch (_) {}
      }).catch(() => {});
    }
  }, [isPlaying]);

  /* Toggle Mute / Unmute */
  const toggleMute = useCallback((e) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  return (
    <div
      className={styles.smallSlideBar}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      aria-label="Devotional Music Small Slide Bar"
    >
      {/* Background Audio with infinite loop */}
      <audio
        ref={audioRef}
        src={devotionalAudioSrc || '/audio/om-namo-venkatesaya.mp3'}
        loop
        preload="auto"
        autoPlay
        onError={(e) => {
          if (e.currentTarget.src.indexOf('om-namo-venkatesaya.mp3') === -1) {
            e.currentTarget.src = '/audio/om-namo-venkatesaya.mp3';
          }
        }}
      />

      {/* Sleek Small Slide Bar */}
      <div className={styles.barPill}>
        {/* Controls that slide out on hover */}
        <div className={styles.slideDrawer}>
          <span className={styles.songLabel}>Om Namo Venkatesaya</span>

          {/* Pause / Play Button */}
          <button
            type="button"
            className={`${styles.ctrlBtn} ${isPlaying ? styles.btnPause : styles.btnPlay}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
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
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
          </button>
        </div>

        {/* Tab Edge Handle (always visible on the right edge) */}
        <div
          className={styles.tabHandle}
          onClick={togglePlay}
          title={isPlaying ? 'Music Playing • Hover to Pause' : 'Music Paused • Click to Play'}
        >
          <span className={styles.omGlyph}>ॐ</span>
          {/* Animated mini sound wave */}
          <div className={`${styles.miniWaves} ${isPlaying ? styles.wavesLive : ''}`}>
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
