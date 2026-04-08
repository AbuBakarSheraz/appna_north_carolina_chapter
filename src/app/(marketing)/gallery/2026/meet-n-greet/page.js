"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Gallery.module.css";

/* ─── utility ───────────────────────────────────────────────────── */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ─── Blur-up tile ──────────────────────────────────────────────── */
function GalleryTile({ image, index, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const delay = `${clamp(index * 40, 0, 600)}ms`;

  return (
    <button
      className={styles.galleryTile}
      style={{ animationDelay: delay }}
      onClick={() => onClick(index)}
      aria-label={`Open photo ${image.alt}`}
    >
      {/* blur placeholder */}
      <img
        className={styles.tileBlur}
        src={image.blur}
        alt=""
        aria-hidden="true"
        style={{ opacity: loaded ? 0 : 1 }}
      />

      {/* browser picks avif → webp → jpg automatically */}
      <picture>
        <source type="image/avif" srcSet={image.thumb.avif} />
        <source type="image/webp" srcSet={image.thumb.webp} />
        <img
          ref={imgRef}
          className={`${styles.tileImg} ${loaded ? styles.tileImgLoaded : ""}`}
          src={image.thumb.fallback}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </picture>

      <span className={styles.tileOverlay} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </span>
    </button>
  );
}

/* ─── Lightbox ──────────────────────────────────────────────────── */
function Lightbox({ images, index, onClose, onNavigate }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef(null);
  const current = images[index];

  useEffect(() => setImgLoaded(false), [index]);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft")  onNavigate(-1);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) onNavigate(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  if (!current) return null;

  return (
    <div
      className={styles.lbBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* header */}
      <header className={styles.lbHeader}>
        <span className={styles.lbCounter}>{index + 1} / {images.length}</span>
        <div className={styles.lbHeaderActions}>
          <button
            className={styles.lbBtn}
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            {zoomed ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M8 11h6" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M11 8v6M8 11h6" />
              </svg>
            )}
          </button>
          <a
            className={styles.lbBtn}
            href={current.full.fallback}
            download
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download full resolution"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
          <button
            className={`${styles.lbBtn} ${styles.lbClose}`}
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* arrows */}
      <button
        className={`${styles.lbNav} ${styles.lbNavPrev}`}
        onClick={() => onNavigate(-1)}
        aria-label="Previous image"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        className={`${styles.lbNav} ${styles.lbNavNext}`}
        onClick={() => onNavigate(1)}
        aria-label="Next image"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* image stage */}
      <div
        className={`${styles.lbStage} ${zoomed ? styles.lbStageZoomed : ""}`}
        onClick={() => setZoomed((z) => !z)}
      >
        <img className={styles.lbBlurBg} src={current.blur} alt="" aria-hidden="true" />

        <picture>
          <source type="image/avif" srcSet={current.full.avif} />
          <source type="image/webp" srcSet={current.full.webp} />
          <img
            className={`${styles.lbImg} ${imgLoaded ? styles.lbImgLoaded : ""} ${zoomed ? styles.lbImgZoom : ""}`}
            src={current.full.fallback}
            alt={current.alt}
            draggable="false"
            onLoad={() => setImgLoaded(true)}
          />
        </picture>

        {!imgLoaded && (
          <div className={styles.lbSpinner} aria-label="Loading">
            <div className={styles.spinnerRing} />
          </div>
        )}
      </div>

      {/* filmstrip */}
      <nav className={styles.lbFilmstrip} aria-label="Image thumbnails">
        {images.map((img, i) => (
          <button
            key={img.id}
            className={`${styles.lbThumb} ${i === index ? styles.lbThumbActive : ""}`}
            onClick={() => onNavigate(i - index)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
          >
            <picture>
              <source type="image/avif" srcSet={img.thumb.avif} />
              <source type="image/webp" srcSet={img.thumb.webp} />
              <img src={img.thumb.fallback} alt={img.alt} loading="lazy" decoding="async" />
            </picture>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────── */
function GallerySkeleton() {
  const heights = [260, 340, 200, 300, 240, 380, 220, 290, 350, 210, 270, 320];
  return (
    <div className={styles.galleryMasonry}>
      {heights.map((h, i) => (
        <div key={i} className={styles.skeletonTile} style={{ height: h }} />
      ))}
    </div>
  );
}

/* ─── Root component ────────────────────────────────────────────── */
export default function Gallery() {
  const [images, setImages]               = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [status, setStatus]               = useState("loading");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => { setImages(data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, []);

  const openLightbox     = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox    = useCallback(() => setLightboxIndex(-1), []);
  const navigateLightbox = useCallback(
    (delta) => setLightboxIndex((prev) => (prev + delta + images.length) % images.length),
    [images.length]
  );

  return (
    <div className={styles.galleryRoot}>
      <header className={styles.galleryHero}>
        <p className={styles.galleryEyebrow}>Visual Collection</p>
        <h1 className={styles.galleryTitle}>Gallery</h1>
        <div className={styles.galleryTitleLine} />
      </header>

      <main className={styles.galleryMain}>
        {status === "loading" && <GallerySkeleton />}

        {status === "error" && (
          <div className={styles.galleryError}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>Failed to load gallery. Please try again.</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {status === "ready" && images.length === 0 && (
          <div className={styles.galleryEmpty}>No images found in your Cloudinary library.</div>
        )}

        {status === "ready" && images.length > 0 && (
          <>
            <p className={styles.galleryCount}>{images.length} photographs</p>
            <div className={styles.galleryMasonry}>
              {images.map((img, i) => (
                <GalleryTile key={img.id} image={img} index={i} onClick={openLightbox} />
              ))}
            </div>
          </>
        )}
      </main>

      {lightboxIndex >= 0 && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}