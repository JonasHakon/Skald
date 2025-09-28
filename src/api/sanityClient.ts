// src/api/sanityClient.ts
import {createClient} from '@sanity/client'

export const sanity = createClient({
  projectId: 'hl1mnev8',
  dataset: 'production',
  apiVersion: '2025-09-14',
  useCdn: true,
})
