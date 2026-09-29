/**
 * DevotionalMusicPlayer.jsx
 *
 * Floating ambient devotional music control for TTD Yatra.
 * Strategy: autoplay MUTED (browsers always allow this), then show a
 * gentle "Tap to hear sound" banner. On tap → unmute. Preference is
 * persisted so returning visitors get music with sound automatically.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DevotionalMusicPlayer.module.css';
import audioSrc from '../../assets/audio/devotional-music.mp3';

const RESOLVED_SRC = audioSrc || '/audio/devotional-music.mp3';
const TRACK_NAME   = 'Sri Venkateswara Suprabhatam & Chants';
const PREF_KEY     = 'ttdyatra_music_unmuted'; // 'true' = user wants sound

/* ═══════════════════════════════════════════════════════════
   DevotionalMusicPlayer
   ═══════════════════════════════════════════════════════════ */
const DevotionalMusicPlayer = () => {
  const audioRef = useRef(null);

  const [expanded,         setExpanded]         = useState(false);
  const [playing,          setPlaying]          = useState(false);
  const [muted,            setMuted]            = useState(true);   // always start muted
  const [showUnmuteBanner, setShowUnmuteBanner] = useState(false);
  const [hasAudio]                              = useState(!!RESOLVED_SRC);

  /* ── Keep audio element in sync with muted state ─────── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  /* ── Autoplay logic ───────────────────────────────────── */
  useEffect(() => {
    if (!hasAudio) return;

    // Did user previously tap "enable sound"?
    let userWantsSound = false;
    try { userWantsSound = localStorage.getItem(PREF_KEY) === 'true'; } catch (_) {}

    const tryPlay = async () => {
      if (!audioRef.current) return;

      // Step 1 – Always attempt muted play first (always succeeds on modern browsers)
      audioRef.current.muted = true;
      try {
        await audioRef.current.play();
        setPlaying(true);
        setMuted(true);

        if (userWantsSound) {
          // Returning user who already tapped → unmute straight away
          setTimeout(() => {
            if (audioRef.current) { audioRef.current.muted = false; }
            setMuted(false);
          }, 400);
        } else {
          // New visitor → show the "tap to hear" banner after 1.5 s
          setTimeout(() => setShowUnmuteBanner(true), 1500);
        }
      } catch (_) {
        // Even muted play failed (very rare) — wait for first interaction
        const onInteraction = async () => {
          if (!audioRef.current) return;
          try {
            audioRef.current.muted = true;
            await audioRef.current.play();
            setPlaying(true);
            setMuted(true);
            setTimeout(() => setShowUnmuteBanner(true), 800);
          } catch (__) {}
          cleanup();
        };
        const cleanup = () => {
          ['click','touchstart','scroll','keydown'].forEach(ev =>
            window.removeEventListener(ev, onInteraction)
          );
        };
        ['click','touchstart','scroll','keydown'].forEach(ev =>
          window.addEventListener(ev, onInteraction, { once: true, passive: true })
        );
      }
    };

    const t = setTimeout(tryPlay, 300);
    return () => clearTimeout(t);
  }, [hasAudio]);

  /* ── Unmute banner tap → enable sound ────────────────── */
  const handleUnmute = useCallback(() => {
    if (audioRef.current) audioRef.current.muted = false;
    setMuted(false);
    setShowUnmuteBanner(false);
    try { localStorage.setItem(PREF_KEY, 'true'); } catch (_) {}
  }, []);

  /* ── Play / Pause ─────────────────────────────────────── */
  const startPlay = useCallback(async () => {
    if (!audioRef.current || !hasAudio) return;
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch (err) {
      setPlaying(false);
    }
  }, [hasAudio]);

  const pausePlay = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    playing ? pausePlay() : startPlay();
  }, [playing, pausePlay, startPlay]);

  /* ── Mute toggle button (in expanded panel) ───────────── */
  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      try { localStorage.setItem(PREF_KEY, String(!next)); } catch (_) {}
      setShowUnmuteBanner(false);
      return next;
    });
  }, []);

  /* ── Floating pill click ──────────────────────────────── */
  const handlePromptClick = useCallback(() => {
    setExpanded(true);
    setShowUnmuteBanner(false);
    if (!playing) startPlay();
  }, [playing, startPlay]);

  const handleClose = useCallback(() => {
    pausePlay();
    setExpanded(false);
  }, [pausePlay]);

  const handleEnded = () => setPlaying(false);

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className={styles.player} role="region" aria-label="Devotional music player">

      {/* Hidden audio element */}
      {hasAudio && (
        <audio
          ref={audioRef}
          src={RESOLVED_SRC}
          loop
          preload="auto"
          muted
          onEnded={handleEnded}
          aria-hidden="true"
        />
      )}

      {/* ── "Tap to hear" banner ─────────────────────────── */}
      {showUnmuteBanner && !expanded && (
        <button
          className={styles.unmuteBanner}
          onClick={handleUnmute}
          aria-label="Tap to enable devotional music sound"
          type="button"
        >
          <span className={styles.unmuteIcon}>🔔</span>
          <span className={styles.unmuteText}>
            <strong>Devotional Music is Playing</strong>
            <span>Tap to enable sound 🔊</span>
          </span>
        </button>
      )}

      {/* ── Expanded panel ───────────────────────────────── */}
      {expanded && (
        <div className={styles.panel} role="group" aria-label="Music controls">
          <button className={styles.closeBtn} onClick={handleClose} type="button" aria-label="Close music player">✕</button>

          <div className={styles.trackInfo}>
            <div className={styles.trackTitle}>
              🎵 {TRACK_NAME}
              {playing && (
                <span className={styles.barsWrap} aria-hidden="true">
                  {[1,2,3,4,5].map(n => <span key={n} className={styles.bar} />)}
                </span>
              )}
            </div>
            <div className={styles.trackStatus}>
              {playing
                ? muted
                  ? 'Playing (muted) — tap 🔊 to hear'
                  : 'Now playing devotional music…'
                : 'Paused'}
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.ctrlBtn} onClick={togglePlay} type="button"
              aria-label={playing ? 'Pause music' : 'Play music'}>
              {playing ? '⏸' : '▶'}
            </button>
            <button className={styles.ctrlBtn} onClick={toggleMute} type="button"
              aria-label={muted ? 'Unmute music' : 'Mute music'} aria-pressed={muted}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      )}

      {/* ── Floating pill ────────────────────────────────── */}
      {!expanded && (
        <button
          className={`${styles.prompt} ${playing ? styles.promptPlaying : ''}`}
          onClick={handlePromptClick}
          type="button"
          aria-label="Devotional background music — Sri Venkateswara Suprabhatam"
        >
          <span className={styles.promptIcon} aria-hidden="true">
            {playing ? (muted ? '🔇' : '🔊') : '🎵'}
          </span>
          <span>
            <span className={styles.promptText}>
              {playing
                ? muted ? 'Muted — tap to open' : 'Playing Suprabhatam'
                : 'Play Devotional Music'}
            </span>
            <br />
            <span className={styles.promptSub}>Om Namo Venkatesaya</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default DevotionalMusicPlayer;
