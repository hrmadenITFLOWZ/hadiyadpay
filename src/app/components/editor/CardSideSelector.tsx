'use client';

import type { CardLanguage } from '../../../lib/card-types';

interface CardSideSelectorProps {
  currentLanguage: CardLanguage;
  activeSide: 'front' | 'inside';
  onSelect: (side: 'front' | 'inside') => void;
}

/*
 * HadiyadPay is now presented to customers as one
 * complete single-sided digital card.
 *
 * This component remains temporarily for compatibility
 * with the existing editor architecture.
 */
export default function CardSideSelector(
  _props: CardSideSelectorProps,
) {
  return null;
}