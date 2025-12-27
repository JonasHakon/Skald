// Import Swiper React components
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";  
import {urlFor} from '../api/image';
import type { ImageRef } from '../types';


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

  // Effect to handle wheel events for navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !swiperRef.current) return;

    const HORIZONTAL_THRESHOLD = 5; // small deadzone for tiny touchpad jitter

    const handleWheel = (e: WheelEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      const { deltaX, deltaY } = e;

      // Only react to *mostly horizontal* scrolls
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return; // let normal vertical scroll happen
      }

      const canMoveLeft = !swiper.isBeginning;
      const canMoveRight = !swiper.isEnd;

      if (!canMoveLeft && !canMoveRight) return;

      // ignore tiny accidental horizontal movement
      if (Math.abs(deltaX) < HORIZONTAL_THRESHOLD) return;

      // Now we actually hijack the scroll
      e.preventDefault();

      if (deltaX > 0 && canMoveRight) {
        swiper.slideNext();
      } else if (deltaX < 0 && canMoveLeft) {
        swiper.slidePrev();
      }
    };

    // non-passive so we can call preventDefault
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      const canMoveLeft = !swiper.isBeginning;
      const canMoveRight = !swiper.isEnd;

      if (e.key === "ArrowRight" && canMoveRight) {
        e.preventDefault();
        swiper.slideNext();
      } else if (e.key === "ArrowLeft" && canMoveLeft) {
        e.preventDefault();
        swiper.slidePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
          centeredSlides
          slidesPerView="auto"
          spaceBetween={5}
          initialSlide={0}
          onSwiper={(sw) => (swiperRef.current = sw)}
          watchSlidesProgress
        >
          {slides}
        </Swiper>
      </div>
    </div>
  );
};