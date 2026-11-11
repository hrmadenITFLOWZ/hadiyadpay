import Image from 'next/image';
import type { CardArtwork, CardLanguage } from '../../lib/card-types';

interface CardArtworkLayerProps {
  artwork: CardArtwork;
  language: CardLanguage;
  decorative?: boolean;
  overlay?: boolean;
}

export default function CardArtworkLayer({
  artwork,
  language,
  decorative = true,
  overlay = true,
}: CardArtworkLayerProps) {
  const alt = decorative ? '' : artwork.alt[language];

  return (
    <div
      aria-hidden={decorative ? true : undefined}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {artwork.type === 'local-image' ? (
        <Image
          src={artwork.src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized={artwork.src.endsWith('.svg')}
          style={{ objectPosition: artwork.focalPoint ?? 'center' }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: artwork.background }} />
      )}
      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/65"
        />
      )}
    </div>
  );
}
