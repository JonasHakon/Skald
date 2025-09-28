// src/types.ts
export type Slug = { _type: 'slug'; current: string };

export type ImageRef = {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
  // Optional crop/hotspot if you enabled them
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
};

export type Person = {
  _id: string;
  name: string;
  slug?: Slug;
  role?: string;
  picture?: ImageRef;
  description?: string;
};

export type Review = { rating: 1 | 2 | 3 | 4 | 5; text: string; name: string };
export type Testimony = { text: string; name: string };

export type Work = {
  _id?: string;
  name: string;
  slug?: Slug;
  description?: string;
  date?: string;
  venue?: string;
  picture?: ImageRef;
  purchaseLink?: string;
  videoLink?: string;
  director?: Person;
  actors?: Person[];
  crew?: Person[];
  reviews?: Review[];
  testimonies?: Testimony[];
};
