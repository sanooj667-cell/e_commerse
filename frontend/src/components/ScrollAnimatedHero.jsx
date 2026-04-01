import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollAnimatedHero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Refs for smooth interpolation
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const requestRef = useRef(null);
  const lastDrawableFrameRef = useRef(null);

  const frameCount = 147;
  const currentFrame = (index) =>
    `/images/herosection/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

  // Preload Images with Tracking
  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages = [];
      let processedCount = 0;

      const promises = Array.from({ length: frameCount }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          const markFrameProcessed = () => {
            processedCount++;
            setLoadProgress(Math.round((processedCount / frameCount) * 100));
          };

          img.onload = () => {
            loadedImages[i] = img;
            markFrameProcessed();
            resolve(img);
          };
          img.onerror = () => {
            loadedImages[i] = null;
            markFrameProcessed();
            resolve(null);
          };
          img.src = currentFrame(i + 1);
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
      setTimeout(() => setLoading(false), 500); // Small delay for smooth exit
    };

    preloadImages();
  }, []);

  // Main Animation Loop
  useEffect(() => {
    if (loading || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false });

    const render = () => {
      // 1. Smooth Interpolation (Lerp)
      const lerpFactor = 0.08; 
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * lerpFactor;

      const progress = currentProgressRef.current;
      const frameIndex = Math.max(1, Math.min(frameCount, Math.floor(progress * (frameCount - 1)) + 1));
      const img = images[frameIndex - 1];
      const hasDrawableImage = img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
      const frameToDraw = hasDrawableImage ? img : lastDrawableFrameRef.current;

      if (hasDrawableImage) {
        lastDrawableFrameRef.current = img;
      }

      if (frameToDraw && frameToDraw.complete && frameToDraw.naturalWidth > 0 && frameToDraw.naturalHeight > 0) {
        // High-DPI Scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          context.scale(dpr, dpr);
        }

        context.imageSmoothingEnabled = true;

        // Dynamic Zoom Logic
        const zoom = 1 + (progress * 0.1); 
        const drawWidth = rect.width * zoom;
        const drawHeight = rect.height * zoom;
        const dx = (rect.width - drawWidth) / 2;
        const dy = (rect.height - drawHeight) / 2;

        context.clearRect(0, 0, rect.width, rect.height);
        context.drawImage(frameToDraw, dx, dy, drawWidth, drawHeight);
      }

      requestRef.current = requestAnimationFrame(render);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = window.scrollY;
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      const rawProgress = Math.max(0, Math.min(1, scrollTop / containerHeight));
      targetProgressRef.current = rawProgress;
    };

    render();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, images]);

  // Sync for text/filters
  const [displayProgress, setDisplayProgress] = useState(0);
  useEffect(() => {
    let frame;
    const updateSync = () => {
      setDisplayProgress(currentProgressRef.current);
      frame = requestAnimationFrame(updateSync);
    };
    updateSync();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-black">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100] bg-black text-[#F8F1E3]"
          >
            <div className="flex flex-col items-center gap-6">
               <div className="relative w-48 h-[2px] bg-[#F8F1E3]/20 overflow-hidden rounded-full">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-[#F8F1E3]"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                  />
               </div>
               <p className="tracking-[0.4em] uppercase text-[10px] font-medium text-[#F8F1E3]/60">
                  Harvesting Quality <span className="text-[#F8F1E3] ml-2">{loadProgress}%</span>
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-all duration-300"
          style={{
             filter: `contrast(1.05) saturate(1.1) brightness(${1 - displayProgress * 0.2})`, 
          }}
        />
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Fixed Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="text-center px-6 w-full max-w-5xl"
          >
          <h1 className="text-6xl md:text-[8rem] font-black text-[#F8F1E3] mb-8 tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-sans uppercase leading-none px-4">
            Nature’s Finest Nuts
          </h1>
            <p className="text-[#E3D4BC] text-lg md:text-xl font-light tracking-[0.4em] uppercase mb-12">
               Premium. Organic. Roasted.
            </p>
           
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pointer-events-auto inline-block"
            >
              <button className="px-14 py-5 bg-[#F8F1E3] text-[#2F2218] font-bold uppercase tracking-widest text-xs rounded-full hover:bg-[#EADCC1] transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.15)]">
                 Shop Collection
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Momentum Indicator */}
        <motion.div 
          className="absolute bottom-12 left-12 z-20 hidden md:flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 - displayProgress * 4 }}
        >
          <div className="flex items-center gap-4">
             <div className="w-8 h-[1px] bg-[#F8F1E3]/40" />
             <span className="text-[#F8F1E3]/45 text-[10px] uppercase tracking-[0.5em]">Scroll Down</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollAnimatedHero;
