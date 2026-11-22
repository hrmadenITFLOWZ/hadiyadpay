import Image from 'next/image';

import {
  getCardArtworkSource,
  type CardArtwork,
  type CardLanguage,
} from '../../lib/card-types';

interface CardArtworkLayerProps {
  artwork: CardArtwork;
  language: CardLanguage;
  decorative?: boolean;
  overlay?: boolean;

  /*
   * cover:
   * Fills the complete container.
   *
   * contain:
   * Shows the complete artwork without cropping,
   * but can leave empty space.
   */
  fit?: 'cover' | 'contain';

  /*
   * Optional display-specific image position.
   *
   * This allows individual card presentations
   * to override their normal focal point without
   * changing the card artwork globally.
   *
   * Examples:
   * 'center'
   * 'center top'
   * '50% 15%'
   */
  objectPosition?: string;

  backgroundColor?: string;
}

export default function CardArtworkLayer({
  artwork,
  language,
  decorative = true,
  overlay = true,
  fit = 'cover',
  objectPosition,
  backgroundColor = '#f7f1e8',
}: CardArtworkLayerProps) {
  const alt =
    decorative
      ? ''
      : artwork.alt[
          language
        ];

  const artworkSource =
    getCardArtworkSource(
      artwork,
      language,
    );

  const objectFitClass =
    fit ===
      'contain'
      ? 'object-contain'
      : 'object-cover';

  const artworkFocalPoint =
    artwork.type ===
      'local-image'
      ? artwork.focalPoint
      : undefined;

  const resolvedObjectPosition =
    objectPosition ??
    artworkFocalPoint ??
    'center';

  return (
    <div
      aria-hidden={
        decorative
          ? true
          : undefined
      }
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        backgroundColor:
          artwork.type ===
          'local-image'
            ? backgroundColor
            : undefined,
      }}
    >
      {artwork.type ===
        'local-image' &&
      artworkSource ? (
        <Image
          src={
            artworkSource
          }
          alt={
            alt
          }
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={
            objectFitClass
          }
          unoptimized={
            artworkSource.endsWith(
              '.svg',
            )
          }
          style={{
            objectPosition:
              resolvedObjectPosition,
          }}
        />
      ) : artwork.type ===
        'gradient' ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              artwork.background,
          }}
        />
      ) : null}

      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/65"
        />
      )}
    </div>
  );
}