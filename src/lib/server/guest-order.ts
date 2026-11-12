import 'server-only';
import type { NextRequest } from 'next/server';

export { createGuestOrderToken, hashGuestOrderToken, matchesGuestOrderToken } from '../order-token';

export function orderCookieName(orderId: string): string {
  return `hadiyadpay_order_${orderId.replace(/-/g, '')}`;
}

export function readGuestOrderToken(request: NextRequest, orderId: string): string | undefined {
  return request.cookies.get(orderCookieName(orderId))?.value;
}

export function guestOrderCookie(token: string, orderId: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${orderCookieName(orderId)}=${token}; Path=/api/orders/${orderId}; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}; Priority=High`;
}
