import { useState } from 'react';
import { Play, Maximize2, Minimize2, Camera, RotateCw, X } from 'lucide-react';

interface VirtualTourProps {
  images: string[];
  title: string;
  className?: string;
}

export default function VirtualTour({ images, title, className = '' }: VirtualTourProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Auto-play slideshow
  const toggleSlideshow = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      let idx = currentIndex;
      const timer = setInterval(() => {
        idx = (idx + 1) % images.length;
        setCurrentIndex(idx);
        // Stop after one full loop
        if (idx === currentIndex) {
          setIsPlaying(false);
          clearInterval(timer);
        }
      }, 2500);
      // Store timer so we can clear on manual interaction
      (window as any).__vtTimer = timer;
    }
  };

  const stopSlideshow = () => {
    if ((window as any).__vtTimer) {
      clearInterval((window as any).__vtTimer);
      (window as any).__vtTimer = null;
    }
    setIsPlaying(false);
  };

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[70] bg-black flex flex-col'
    : `relative rounded-xl overflow-hidden ${className}`;

  return (
    <>
      <div className={containerClass}>
        {/* Main Image */}
        <div className="relative flex-1 flex items-center justify-center bg-gray-900">
          <img
            src={images[currentIndex]}
            alt={`${title} - ${currentIndex + 1}`}
            className={`object-contain ${fullscreen ? 'max-h-screen max-w-full' : 'w-full h-64 sm:h-80'}`}
          />

          {/* Navigation Arrows */}
          <button onClick={() => { stopSlideshow(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all">
            <RotateCw size={18} className="rotate-180" />
          </button>
          <button onClick={() => { stopSlideshow(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all">
            <RotateCw size={18} />
          </button>

          {/* Controls */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
            <button onClick={toggleSlideshow} className={`p-1.5 rounded-full transition-colors ${isPlaying ? 'bg-emerald-500 text-white' : 'text-white hover:bg-white/20'}`}>
              <Play size={14} fill={isPlaying ? 'currentColor' : 'none'} />
            </button>
            <span className="text-xs text-white font-medium tabular-nums">{currentIndex + 1} / {images.length}</span>
            <button onClick={() => setShowLightbox(true)} className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors">
              <Camera size={14} />
            </button>
            <button onClick={() => setFullscreen(!fullscreen)} className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors">
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            {fullscreen && (
              <button onClick={() => setFullscreen(false)} className="p-1.5 rounded-full text-white hover:bg-red-500/50 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {!fullscreen && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1 px-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { stopSlideshow(); setCurrentIndex(i); }}
                  className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-emerald-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info bar */}
        {!fullscreen && (
          <div className="p-3 bg-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">{title}</h3>
              <p className="text-xs text-gray-400">Virtual Tour &middot; {images.length} views</p>
            </div>
            <div className="flex gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Camera size={12} /> 360°</span>
              <span className="flex items-center gap-1"><Maximize2 size={12} /> Fullscreen</span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Grid */}
      {showLightbox && (
        <div className="fixed inset-0 z-[80] bg-black/95 flex flex-col" onClick={() => setShowLightbox(false)}>
          <div className="flex items-center justify-between p-4">
            <h3 className="text-white font-semibold">{title} — All Photos</h3>
            <button onClick={() => setShowLightbox(false)} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} className="text-white" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setShowLightbox(false); }}
                className={`relative rounded-xl overflow-hidden aspect-video group ${i === currentIndex ? 'ring-2 ring-emerald-400' : ''}`}
              >
                <img src={img} alt={`${title} - ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
