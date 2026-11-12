import type { CardLanguage, CardOption } from './card-types';
import type { EditorSideState, EditorTextLayer } from './card-editor';

const fontFamilies = {
  sans: 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, Times New Roman, serif',
  mono: 'Courier New, monospace',
} as const;

const textHeights: Record<EditorTextLayer, number> = {
  recipient: 18,
  message: 28,
  sender: 16,
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderTextLayer(side: EditorSideState, layer: EditorTextLayer): string {
  const position = side.textPositions[layer];
  const style = side.textStyles[layer];
  const value = side[layer];
  const y = position.y - textHeights[layer] / 2;
  const x = position.x - 43;
  const messagePanel = layer === 'message' && value
    ? `<rect x="${x}%" y="${y}%" width="86%" height="${textHeights[layer]}%" rx="24" fill="#141c17" fill-opacity=".28"/>`
    : '';
  return `${messagePanel}<foreignObject x="${x}%" y="${y}%" width="86%" height="${textHeights[layer]}%"><div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0 2%;color:${escapeXml(style.color)};font-family:${fontFamilies[style.family]};font-size:${style.size * 3}px;font-weight:${style.bold ? 700 : 400};font-style:${style.italic ? 'italic' : 'normal'};text-decoration:${style.underline ? 'underline' : 'none'};text-align:${style.align};line-height:1.18;white-space:pre-wrap;overflow-wrap:anywhere;text-shadow:0 2px 8px #000,0 1px 2px #000">${escapeXml(value)}</div></foreignObject>`;
}

export function renderCardSvg(
  card: CardOption,
  language: CardLanguage,
  side: EditorSideState,
  artworkDataUrl: string,
  photoDataUrl?: string,
): string {
  const width = 1200;
  const height = card.orientation === 'portrait' ? 1464 : 968;
  const photo = side.photo;
  const photoSize = width * 0.22 * (photo?.scale ?? 1);
  const photoCenterX = ((photo?.x ?? 50) / 100) * width;
  const photoCenterY = ((photo?.y ?? 50) / 100) * height;
  const photoMarkup = photo && photoDataUrl
    ? `<defs><clipPath id="photo-clip"><circle cx="${photoCenterX}" cy="${photoCenterY}" r="${width * 0.11}"/></clipPath></defs><circle cx="${photoCenterX}" cy="${photoCenterY}" r="${width * 0.11 + 8}" fill="#fffefa" opacity=".96"/><image href="${escapeXml(photoDataUrl)}" x="${photoCenterX - photoSize / 2}" y="${photoCenterY - photoSize / 2}" width="${photoSize}" height="${photoSize}" preserveAspectRatio="xMidYMid slice" transform="rotate(${photo?.rotation ?? 0} ${photoCenterX} ${photoCenterY})" clip-path="url(#photo-clip)"/>`
    : '';
  const title = escapeXml(card.title[language]);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="card-title"><title id="card-title">${title}</title><defs><linearGradient id="card-shade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#101713" stop-opacity=".12"/><stop offset=".48" stop-color="#101713" stop-opacity=".02"/><stop offset="1" stop-color="#101713" stop-opacity=".48"/></linearGradient><filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".58"/></filter></defs><image href="${escapeXml(artworkDataUrl)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/><rect width="${width}" height="${height}" fill="url(#card-shade)"/><text x="6%" y="7%" fill="#fff4d7" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="5" filter="url(#soft-shadow)">HADIYADPAY</text>${photoMarkup}${renderTextLayer(side, 'recipient')}${renderTextLayer(side, 'message')}${renderTextLayer(side, 'sender')}</svg>`;
}
