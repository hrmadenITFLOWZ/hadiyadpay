import type { CardLanguage, CardOption } from './card-types';
import type { EditorPosition, EditorSideState, EditorTextLayer } from './card-editor';

export type CardSide = 'front' | 'inside';

export interface CardCompositionLayout {
  showArtwork: boolean;
  showBrand: boolean;
  protectsBirthdayArtwork: boolean;
  defaultTextColor: string;
  textHeights: Record<EditorTextLayer, number>;
  defaultTextPositions: Record<EditorTextLayer, EditorPosition>;
  defaultPhotoPosition: EditorPosition;
}

export const cardInsideColors = {
  background: '#fffaf0',
  border: '#d8bd8d',
  ornament: '#b47855',
  text: '#31483e',
} as const;

const standardTextHeights: Record<EditorTextLayer, number> = {
  recipient: 18,
  message: 28,
  sender: 16,
};

const birthdayFrontTextHeights: Record<EditorTextLayer, number> = {
  recipient: 7,
  message: 23,
  sender: 7,
};

const insideTextHeights: Record<EditorTextLayer, number> = {
  recipient: 10,
  message: 30,
  sender: 9,
};

const standardFrontPositions: Record<EditorTextLayer, EditorPosition> = {
  recipient: { x: 50, y: 14 },
  message: { x: 50, y: 70 },
  sender: { x: 50, y: 92 },
};

const birthdayFrontPositions: Record<EditorTextLayer, EditorPosition> = {
  recipient: { x: 50, y: 65 },
  message: { x: 50, y: 80 },
  sender: { x: 50, y: 96 },
};

const insidePositions: Record<EditorTextLayer, EditorPosition> = {
  recipient: { x: 50, y: 20 },
  message: { x: 50, y: 53 },
  sender: { x: 50, y: 84 },
};

export function getCardComposition(card: CardOption, side: CardSide): CardCompositionLayout {
  const isBirthdayFront = card.id === 'dhalasho' && side === 'front';
  return {
    showArtwork: side === 'front',
    showBrand: side === 'front',
    protectsBirthdayArtwork: isBirthdayFront,
    defaultTextColor: side === 'inside'
      ? cardInsideColors.text
      : isBirthdayFront
        ? '#5a3129'
        : '#fef3c7',
    textHeights: isBirthdayFront
      ? birthdayFrontTextHeights
      : side === 'inside'
        ? insideTextHeights
        : standardTextHeights,
    defaultTextPositions: side === 'inside'
      ? insidePositions
      : isBirthdayFront
        ? birthdayFrontPositions
        : standardFrontPositions,
    defaultPhotoPosition: isBirthdayFront
      ? { x: 89, y: 31 }
      : { x: 84, y: 80 },
  };
}

const fontFamilies = {
  sans: 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, Times New Roman, serif',
  mono: 'Courier New, monospace',
} as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderTextLayer(
  side: EditorSideState,
  layer: EditorTextLayer,
  layout: CardCompositionLayout,
): string {
  const position = side.textPositions[layer];
  const style = side.textStyles[layer];
  const value = side[layer];
  const height = layout.textHeights[layer];
  const x = position.x - 43;
  const y = position.y - height / 2;
  const color = style.color;
  const fontSize = layout.protectsBirthdayArtwork
    ? layer === 'message'
      ? Math.max(8, Math.min(style.size * 12 / 5.5, 1200 * 0.052))
      : Math.min(style.size * 12 / 5, 1200 * 0.065)
    : style.size * 3;
  const lineHeight = layout.protectsBirthdayArtwork ? 1.08 : 1.18;

  const textShadow = layout.showArtwork && !layout.protectsBirthdayArtwork
    ? '0 2px 8px #000,0 1px 2px #000'
    : 'none';
  return `<foreignObject x="${x}%" y="${y}%" width="86%" height="${height}%"><div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;width:100%;height:100%;display:flex;align-items:center;justify-content:${style.align === 'left' ? 'flex-start' : style.align === 'right' ? 'flex-end' : 'center'};overflow:hidden;padding:0 2%;color:${escapeXml(color)};font-family:${fontFamilies[style.family]};font-size:${fontSize}px;font-weight:${style.bold ? 700 : 400};font-style:${style.italic ? 'italic' : 'normal'};text-decoration:${style.underline ? 'underline' : 'none'};text-align:${style.align};line-height:${lineHeight};white-space:pre-wrap;overflow-wrap:anywhere;text-shadow:${textShadow}">${escapeXml(value)}</div></foreignObject>`;
}

export function renderCardSvg(
  card: CardOption,
  language: CardLanguage,
  cardSide: CardSide,
  side: EditorSideState,
  artworkDataUrl: string,
  photoDataUrl?: string,
): string {
  const width = 1200;
  const height = card.orientation === 'portrait' ? 1464 : 968;
  const layout = getCardComposition(card, cardSide);
  const photo = side.photo;
  const photoSize = width * 0.22 * (photo?.scale ?? 1);
  const photoCenterX = ((photo?.x ?? 50) / 100) * width;
  const photoCenterY = ((photo?.y ?? 50) / 100) * height;
  const photoMarkup = photo && photoDataUrl
    ? `<defs><clipPath id="photo-clip"><circle cx="${photoCenterX}" cy="${photoCenterY}" r="${width * 0.11}"/></clipPath></defs><circle cx="${photoCenterX}" cy="${photoCenterY}" r="${width * 0.11 + 8}" fill="#fffefa" opacity=".96"/><image href="${escapeXml(photoDataUrl)}" x="${photoCenterX - photoSize / 2}" y="${photoCenterY - photoSize / 2}" width="${photoSize}" height="${photoSize}" preserveAspectRatio="xMidYMid slice" transform="rotate(${photo?.rotation ?? 0} ${photoCenterX} ${photoCenterY})" clip-path="url(#photo-clip)"/>`
    : '';
  const artwork = layout.showArtwork
    ? card.artwork.type === 'local-image'
      ? `<image href="${escapeXml(artworkDataUrl)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`
      : `<rect width="${width}" height="${height}" fill="${escapeXml(card.artwork.background)}"/>`
    : `<rect width="${width}" height="${height}" fill="${cardInsideColors.background}"/><rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="28" fill="none" stroke="${cardInsideColors.border}" stroke-width="4"/><path d="M92 150h270m476 0h270M92 ${height - 150}h270m476 0h270" stroke="${cardInsideColors.border}" stroke-width="3"/><circle cx="600" cy="150" r="13" fill="${cardInsideColors.ornament}"/><circle cx="600" cy="${height - 150}" r="13" fill="${cardInsideColors.ornament}"/>`;
  const brand = layout.showBrand
    ? `<text x="6%" y="7%" fill="#fff4d7" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="5" filter="url(#soft-shadow)">HADIYADPAY</text>`
    : '';
  const title = escapeXml(card.title[language]);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="card-title"><title id="card-title">${title}</title><defs><filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".58"/></filter></defs>${artwork}${photoMarkup}${brand}${renderTextLayer(side, 'recipient', layout)}${renderTextLayer(side, 'message', layout)}${renderTextLayer(side, 'sender', layout)}</svg>`;
}
