// src/types.ts
export type Slug = { _type: 'slug'; current: string };

export type ImageRef = {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
  // Optional crop/hotspot if you enabled them
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
};

export type Artist = {
  _id?: string;
  name?: string;
  firstName?: string
  lastName?: string
  slug?: Slug;
  picture?: ImageRef;
  secondPicture?: ImageRef
  signaturePicture?: ImageRef
  description?: string;
  height?: number
  eyeColor?: string
  hair?: string
};

export type Review = { rating: 1 | 2 | 3 | 4 | 5; text: string; name: string };
export type Testimony = { text: string; name: string };

export type Work = {
  _id?: string;
  name: string;
  slug?: Slug;
  venue?: string;
  author?: string;
  date?: string;
  picture?: ImageRef;
  gallery1?: ImageRef[];
  gallery2?: ImageRef[];
  description1?: string;
  description2?: string;
  purchaseLink?: string;
  videoLink?: string;
};


export type WorkCard = {
  name: string
  description: string
  author: string
  slug?: Slug
  picture?: ImageRef
}