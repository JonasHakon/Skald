// Import Swiper React components
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";  
import {urlFor} from '../api/image';
import type { Artist } from '../types';
import {Link} from "react-router-dom";


// Define a type for SwiperSlide elements with progress property
type SwiperSlideElement = HTMLElement & { progress: number };

export function Carousel({ items }: { items: Artist[] }) {

  // Refs to Swiper instance and container element
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Effect to handle wheel events for navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !swiperRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      // Only hijack if we can actually move
      const canMoveLeft = !swiper.isBeginning;
      const canMoveRight = !swiper.isEnd;

      if (!canMoveLeft && !canMoveRight) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        swiper.slideNext();
      } else {
        swiper.slidePrev();
      }
    };

    // 👇 non-passive listener
    el.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup on unmount
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="carousel-viewport"  ref={containerRef}>
      <div className="carousel-track" >
        <Swiper
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={-165}       // To account for scaling
          initialSlide={1}
          onSwiper={(sw) => (swiperRef.current = sw)} // caoture swiper instance
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
              mainImg.style.transform = `translateX(${translateX}px) scale(${scale})`;

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
                        src={urlFor(item.picture!).height(860).width(480).url()}
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