// Import Swiper React components
import { useRef, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from "swiper";  
import {urlFor} from '../api/image';
import type { Artist } from '../types';
import {Link} from "react-router-dom";
import 'swiper/css';
import 'swiper/css/mousewheel';


// Define a type for SwiperSlide elements with progress property
type SwiperSlideElement = HTMLElement & { progress: number };

export function Carousel({ items }: { items: Artist[] }) {

  const swiperRef = useRef<SwiperType | null>(null);
  const centeringTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranslateRef = useRef<number>(0);
  const monitoringRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isUserInteractingRef = useRef<boolean>(false);

  const centerClosestSlide = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || isUserInteractingRef.current) {
      return;
    }

    let closestIndex = swiper.activeIndex;
    let minProgress = Infinity;

    swiper.slides.forEach((slide, index) => {
      const slideEl = slide as SwiperSlideElement;
      const absProgress = Math.abs(slideEl.progress);
      if (absProgress < minProgress) {
        minProgress = absProgress;
        closestIndex = index;
      }
    });

    const closestSlide = swiper.slides[closestIndex] as SwiperSlideElement;
    
    if (Math.abs(closestSlide.progress) < 0.05) {
      return;
    }

    const targetTranslate = swiper.slidesGrid[closestIndex] * -1;
    const currentTranslate = swiper.translate;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const newTranslate = currentTranslate + (targetTranslate - currentTranslate) * eased;
      swiper.setTranslate(newTranslate);
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const startMagneticPull = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    monitoringRef.current = true;

    const applyMagneticForce = () => {
      const swiper = swiperRef.current;
      if (!swiper) {
        monitoringRef.current = false;
        return;
      }

      const currentTranslate = swiper.translate;
      const delta = Math.abs(currentTranslate - lastTranslateRef.current);
      
      lastTranslateRef.current = currentTranslate;

      if (!isUserInteractingRef.current) {
        let closestIndex = swiper.activeIndex;
        let minProgress = Infinity;

        swiper.slides.forEach((slide, index) => {
          const slideEl = slide as SwiperSlideElement;
          const absProgress = Math.abs(slideEl.progress);
          if (absProgress < minProgress) {
            minProgress = absProgress;
            closestIndex = index;
          }
        });

        const closestSlide = swiper.slides[closestIndex] as SwiperSlideElement;
        const targetTranslate = swiper.slidesGrid[closestIndex] * -1;
        
        const distanceFromCenter = Math.abs(closestSlide.progress);
        
        if (distanceFromCenter > 0.01) {
          const velocityFactor = Math.min(delta / 10, 1.0);
          const basePullStrength = 0.08;
          const pullStrength = basePullStrength * (1 + velocityFactor);
          
          const adjustment = (targetTranslate - currentTranslate) * pullStrength;
          
          const newTranslate = currentTranslate + adjustment;
          swiper.setTranslate(newTranslate);
          swiper.updateProgress();
          swiper.updateSlidesClasses();
        }
        
        if (delta < 0.05 && distanceFromCenter < 0.02) {
          monitoringRef.current = false;
          return;
        }
      }

      rafIdRef.current = requestAnimationFrame(applyMagneticForce);
    };

    rafIdRef.current = requestAnimationFrame(applyMagneticForce);
  }, []);

  const handleInteractionStart = useCallback(() => {
    isUserInteractingRef.current = true;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    monitoringRef.current = false;
  }, []);

  const handleInteractionEnd = useCallback(() => {
    isUserInteractingRef.current = false;
    lastTranslateRef.current = swiperRef.current?.translate ?? 0;
    startMagneticPull();
  }, [startMagneticPull]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = () => {
      handleInteractionStart();
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        handleInteractionEnd();
      }, 150);
    };

    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [handleInteractionStart, handleInteractionEnd]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (centeringTimeoutRef.current) {
        clearTimeout(centeringTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="carousel-viewport" ref={containerRef}>
      <div className="carousel-track" >
        <Swiper
          modules={[Mousewheel, Keyboard, FreeMode]}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.5,
            releaseOnEdges: true,
            thresholdDelta: 10,
            thresholdTime: 100,
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          freeMode={{
            enabled: true,
            sticky: false,
            momentum: true,
            momentumRatio: 0.5,
          }}
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={5}
          initialSlide={1}
          onSwiper={(sw) => (swiperRef.current = sw)}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          watchSlidesProgress={true}

          // Custom swiper scaling and translation effect
          onProgress={(swiper) => {
            swiper.slides.forEach((slideEl) => {
              const slide = slideEl as SwiperSlideElement;
              const mainImg = slide.querySelector("img.main-image") as HTMLImageElement | null;
              const sigImg = slide.querySelector("img.signature-image") as HTMLImageElement | null;

              if (!mainImg) return;
              if (!sigImg) return;

              // Progress goes from -5 to 5 (if 5 slides in view)
              const progress = slide.progress;

              // t is:
              //  1 <=> progress =  0
              //  ]0,1[ : if progress is in ]-1, 1[ 
              //  0 <=> abs(progress) >= 1
              const t = 1 - Math.min(Math.abs(progress), 1);

              const minScale = 0.50; // c.a. 180 / 220
              const maxScale = 1;  // c.a. 340 / 430
              const scale = minScale + (maxScale - minScale) * t;

              // How much horizontal "leftover" space (in px) inside the slide
              const slideWidth = 340; // must match CSS width
              const contentWidth = slideWidth * scale;
              const leftover = slideWidth - contentWidth; // space not used by image

              // We want *most* of that leftover on the outside,
              // so we move images towards the center.
              // progress > 0 => slide is to the right -> move image left (negative)
              // progress < 0 => slide is to the left -> move image right (positive)
              const direction = progress > 0 ? -1 : 1;

              // how aggressively to pull them in (1 = full)
              const pullFactor = 0.55;

              const translateX = direction * (leftover) * pullFactor;

              // Main image transform
              slide.style.transform = `translateX(${translateX}px) scale(${scale})`;

              // Signature image transform
              const inactiveOffsetY = 40;  // further down when inactive
              const activeOffsetY = 0;     // sits nicely below image when active

              const offsetY = inactiveOffsetY * (1 - t) + activeOffsetY * t;
              const opacity = t; // fade in as it becomes active

              sigImg.style.opacity = `${opacity}`;
              sigImg.style.transform = `translate(-50%, ${offsetY}px)`;
            });
          }}
        >
          {
            items.filter((item) => item.picture?.asset?._ref && item.signaturePicture?.asset?._ref)
            .map((item) => (
              item.picture && (
                <SwiperSlide key={item.slug?.current}>
                  <Link to={`/artists/${item.slug?.current}`} className="slide-link">
                    <div className="slide-inner">
                      <img
                        className="main-image"
                        src={urlFor(item.picture!).height(860).width(680).url()}
                        alt={item.name}
                        />
                      <img
                        className="signature-image"
                        src={urlFor(item.signaturePicture!).height(240).width(240).url()}
                        alt={`${item.name} signature`}
                        />  
                    </div>
                  </Link>
                </SwiperSlide>  
              )
            ))
          }
        </Swiper>
      </div>
    </div>
  );
};