import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CardLanguage } from '../../../lib/card-types';
import OrderStatus from './OrderStatus';

export const metadata: Metadata = {
  title: 'Orderstatus',
  robots: { index: false, follow: false },
};

const isLanguage = (value: string | string[] | undefined): value is CardLanguage =>
  value === 'so' || value === 'en' || value === 'nl';

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ language?: string | string[]; cancelled?: string | string[] }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const language = isLanguage(query.language) ? query.language : 'nl';
  return <OrderStatus orderId={id} language={language} wasCancelled={query.cancelled === '1'} />;
}
