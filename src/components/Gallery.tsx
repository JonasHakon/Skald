// Import Swiper React components
import { useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from "swiper";  
import {urlFor} from '../api/image';
import type { ImageRef } from '../types';
import 'swiper/css';
import 'swiper/css/mousewheel';

type SwiperSlideElement = HTMLElement & { progress: number };


export function Gallery(
  {
    items = [],
    text,
    reversed = false,
  }: {
    items?: ImageRef[]
    text?: string
    reversed?: boolean
  }
) {
  
  // Refs to Swiper instance and container element
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centeringTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranslateRef = useRef<number>(0);
  const monitoringRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef<boolean>(false);

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

  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw) return;

    // Swiper needs to know slides changed
    sw.update();

    const idx = reversed ? sw.slides.length - 2 : 0;
    sw.slideTo(idx, 0); // 0ms = no animation
  }, [reversed, items.length, text]);


  // Build image slides once
  const imageSlides = items.map((item) => (
    <SwiperSlide key={item.asset._ref}>
      <div className="slide-inner">
        <img
          className="main-image"
          src={urlFor(item).height(400).width(600).url()}
          alt={item.asset._ref}
        />
      </div>
    </SwiperSlide>
  ));

  const textSlide = (
    <SwiperSlide key="text-slide">
      <div className={`text-slide${reversed ? "-reversed" : ""}`}>
        <p>{text}</p>
      </div>
    </SwiperSlide>
  );

  // If reversed, images first and text last; otherwise text first and images after
  const slides = reversed
    ? [...imageSlides, textSlide]
    : [textSlide, ...imageSlides];

  return (
    <div className="carousel-viewport"  ref={containerRef}>
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
          initialSlide={0}
          onSwiper={(sw) => (swiperRef.current = sw)}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          watchSlidesProgress={true}
        >
          {slides}
        </Swiper>
      </div>
    </div>
  );
};