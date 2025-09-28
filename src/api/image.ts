// src/api/image.ts
import imageUrlBuilder from '@sanity/image-url'
import {sanity} from './sanityClient'
import type {ImageRef} from '../types'

const builder = imageUrlBuilder(sanity)

export function urlFor(src: ImageRef) {
  return builder.image(src)
}

// helpers to avoid `any`
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function isImageRef(value: unknown): value is ImageRef {
  if (!isRecord(value)) return false
  if (value._type !== 'image') return false
  const asset = (value as Record<string, unknown>).asset
  if (!isRecord(asset)) return false
  return typeof asset._ref === 'string'
}
