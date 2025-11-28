// ArtistsList.tsx
import { useEffect, useState } from "react";
import { sanity } from "../api/sanityClient";
import { Navigation } from "../components/Navigation";
import type { Artist } from "../types";
import '../styles/ArtistList.css';
import { Carousel } from "../components/Carousel";

const PEOPLE_MEDIA_QUERY = `
*[_type=="person"] | order(name asc) {
  slug,
  picture{ _type, asset },
  signaturePicture{ _type, asset }
}
`;

export function ArtistsList() {
  const [people, setPeople] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    sanity
      .fetch<Artist[]>(PEOPLE_MEDIA_QUERY)
      .then((list) => {
        if (active) setPeople(list);
      })
      .catch(() => active && setError("Failed to load media"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <Navigation className="artist-list">
      {people.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <Carousel items={people} />
      )}
    </Navigation>
  );
}
