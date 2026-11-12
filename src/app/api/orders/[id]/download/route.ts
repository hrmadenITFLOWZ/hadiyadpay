import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';
import { cardOptions } from '../../../../data/cardOptions';
import { parseOrderDraft } from '../../../../../lib/card-order';
import { renderCardSvg } from '../../../../../lib/card-composition';
import { canDownloadOrder } from '../../../../../lib/server/payment-policy';
import { getOrderForGuest } from '../../../../../lib/server/order-access';
import { verifyAndRecordPaidOrder } from '../../../../../lib/server/payment-confirmation';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let order: Awaited<ReturnType<typeof getOrderForGuest>>;
  try {
    order = await getOrderForGuest(request, id);
  } catch (error) {
    console.error('Unable to load card download order', {
      orderId: id,
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Card download is temporarily unavailable' }, { status: 503 });
  }
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const sideName = request.nextUrl.searchParams.get('side');
  if (sideName !== 'front' && sideName !== 'inside') {
    return NextResponse.json({ error: 'Choose a card side' }, { status: 400 });
  }

  let paymentVerified = false;
  let paidOrder = order;
  try {
    paymentVerified = await verifyAndRecordPaidOrder(order);
    if (paymentVerified) paidOrder = (await getOrderForGuest(request, id)) ?? order;
  } catch (error) {
    console.error('Unable to verify card download entitlement', {
      orderId: id,
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Payment verification is temporarily unavailable' }, { status: 503 });
  }

  if (!canDownloadOrder(paidOrder, true, paymentVerified)) {
    return NextResponse.json({ error: 'A verified payment is required to download this card' }, { status: 403 });
  }

  const card = cardOptions.find((option) => option.id === paidOrder.card_id);
  if (!card || card.artwork.type !== 'local-image') {
    console.error('Card artwork is unavailable for a paid order', { orderId: id });
    return NextResponse.json({ error: 'Card download is unavailable' }, { status: 500 });
  }

  try {
    const artworkPath = join(process.cwd(), 'public', card.artwork.src.slice(1));
    const artwork = await readFile(artworkPath);
    const artworkMime = card.artwork.src.endsWith('.svg') ? 'image/svg+xml' : card.artwork.src.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    const artworkDataUrl = `data:${artworkMime};base64,${artwork.toString('base64')}`;
    const draft = parseOrderDraft(
      paidOrder.customization,
      card,
      paidOrder.language,
      paidOrder.photo_front !== null,
      paidOrder.photo_inside !== null,
    );
    const selectedSide = draft[sideName];
    const photo = sideName === 'front' ? paidOrder.photo_front : paidOrder.photo_inside;
    const photoMime = sideName === 'front' ? paidOrder.photo_front_mime : paidOrder.photo_inside_mime;
    const photoDataUrl = photo && photoMime
      ? `data:${photoMime};base64,${photo.toString('base64')}`
      : undefined;
    const svg = renderCardSvg(card, paidOrder.language, selectedSide, artworkDataUrl, photoDataUrl);
    const filename = `${card.slug}-${sideName}.svg`;

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
      },
    });
  } catch (error) {
    console.error('Unable to render paid card download', {
      orderId: id,
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Card download could not be generated' }, { status: 500 });
  }
}
