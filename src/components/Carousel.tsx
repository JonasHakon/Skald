// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import {urlFor} from '../api/image'
import type { Artist } from '../types'

type SwiperSlideElement = HTMLElement & { progress: number };


export function Carousel({ items }: { items: Artist[] }) {
  return (
        <div className="carousel-viewport">
      <div className="carousel-track">
    <Swiper
  centeredSlides={true}
  slidesPerView="auto"
  spaceBetween={-160}
  initialSlide={1}

  watchSlidesProgress={true}
onProgress={(swiper) => {
          swiper.slides.forEach((slideEl) => {
            const slide = slideEl as SwiperSlideElement;
            const img = slide.querySelector("img") as HTMLImageElement | null;
            if (!img) return;

            // Progress goes from -5 to 5 (if 5 slides in view)
            const progress = slide.progress;

            // t is:
            //  1 <=> progress =  0
            //  ]0,1[ : if progress is in ]-0.333, 0.3333[ 
            //  0 <=> abs(progress) >= 0.3333
            const t = 1 - Math.min(Math.abs(progress), 1);

            const minScale = 0.50; // c.a. 180 / 220
            const maxScale = 1.0;  // c.a. 340 / 430
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
            const pullFactor = 0.7; // try 0.7 if it feels too tight

            const translateX = direction * (leftover) * pullFactor;

            img.style.transform = `translateX(${translateX}px) scale(${scale})`;
          });
        }}
      >
        {
          items.filter((item) => item.picture?.asset?._ref)
          .map((item) => (
            item.picture && (
              <SwiperSlide key={item.slug?.current}>
              <img
                src={urlFor(item.picture).height(430).width(240).url()}
                alt={item.name}
              />              
            </SwiperSlide>  
            )
          ))
        }
      </Swiper>
    </div>
    </div>
  );
};