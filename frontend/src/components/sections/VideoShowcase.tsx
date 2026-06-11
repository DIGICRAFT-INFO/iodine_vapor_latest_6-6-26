'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { showcaseVideosApi, imgUrl } from '@/lib/api';

export default function VideoShowcase() {
  const [flash, setFlash] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const touchStartY = useRef(0);

  const { data: videos = [] } = useQuery({
    queryKey: ['showcase-videos'],
    queryFn: showcaseVideosApi.get,
  });

  // Auto-advance videos
  useEffect(() => {
    if (!showVideos || !videos.length || videos.length <= 1) return;
    const t = setInterval(() => setCurrentVideo(c => (c + 1) % videos.length), 8000);
    return () => clearInterval(t);
  }, [showVideos, videos]);

  // Flash effect then show videos
  const handleShutter = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    setTimeout(() => setShowVideos(true), 500);
  };

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!videos.length || videos.length <= 1) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) setCurrentVideo(c => (c + 1) % videos.length);
      else setCurrentVideo(c => (c - 1 + videos.length) % videos.length);
    }
  };

  const hasVideos = videos.length > 0;

  return (
    <>
      {/* Flash Overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[2000]"
            style={{ background: '#ffffff', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1500] flex items-center justify-center"
            style={{ background: 'rgba(6,6,6,0.97)', backdropFilter: 'blur(20px)' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => setShowVideos(false)}
              className="absolute top-6 right-6 z-20 font-mono text-[0.6rem] tracking-[0.15em] uppercase px-4 py-2 border transition-all hover:border-gold-DEFAULT hover:text-gold-DEFAULT"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(0,0,0,0.55)', borderRadius: '2px' }}
            >
              ✕ Close
            </button>

            {!hasVideos ? (
              <div className="text-center">
                <div className="font-display text-[2rem] mb-3" style={{ color: 'var(--c-gold)' }}>📽️</div>
                <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.35)' }}>No videos uploaded yet</p>
                <p className="text-[0.8rem] mt-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Add videos from Admin → Showcase Videos</p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVideo}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <video
                        key={videos[currentVideo]?.videoUrl}
                        src={imgUrl(videos[currentVideo]?.videoUrl)}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                      <h3 className="font-serif text-[1.3rem] md:text-[1.6rem]" style={{ color: 'var(--c-cream)' }}>
                        {videos[currentVideo]?.title}
                      </h3>
                      {videos[currentVideo]?.description && (
                        <p className="font-mono text-[0.58rem] tracking-[0.12em] mt-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
                          {videos[currentVideo].description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {videos.length > 1 && (
                  <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
                    {videos.map((_: any, i: number) => (
                      <button key={i} onClick={() => setCurrentVideo(i)}
                        className="transition-all duration-300"
                        style={{ width: '6px', height: i === currentVideo ? '28px' : '6px', borderRadius: '3px', background: i === currentVideo ? 'var(--c-gold)' : 'rgba(0,0,0,0.25)', transition: 'all 0.3s' }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Button — fixed, big, right side on desktop, bottom-right on mobile */}
      <button
        onClick={handleShutter}
        className="fixed z-[50] group"
        style={{
          bottom: '50%',
          right: '24px',
          transform: 'translateY(50%)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3a7bd5, #c9a96e, #e91e8c)',
          padding: '3px',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(201,169,110,0.3), 0 0 60px rgba(58,123,213,0.15)',
        }}
        aria-label="Open video showcase"
      >
        <div className="w-full h-full rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: '#ffffff' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#camGradBtn)" strokeWidth="1.5">
            <defs>
              <linearGradient id="camGradBtn" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3a7bd5" />
                <stop offset="50%" stopColor="#c9a96e" />
                <stop offset="100%" stopColor="#e91e8c" />
              </linearGradient>
            </defs>
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <circle cx="12" cy="13" r="4" />
            <path d="M7 3h4l1 3H6l1-3z" />
          </svg>
        </div>
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-15" style={{ background: 'linear-gradient(135deg, #3a7bd5, #c9a96e, #e91e8c)' }} />
      </button>
    </>
  );
}
