'use client';

import type { CardLanguage } from '../../../lib/card-types';

interface EditorStatusProps {
  currentLanguage: CardLanguage;
  shareNotice?: string | null;
  photoRequiresReselection: boolean;
}

export default function EditorStatus({ currentLanguage, shareNotice, photoRequiresReselection }: EditorStatusProps) {
  const locale = {
    so: {
      reselect: 'Sawirka hore wuxuu u baahan yahay inaad mar kale doorato.',
    },
    en: {
      reselect: 'The previous photo needs to be selected again.',
    },
    nl: {
      reselect: 'De vorige foto moet opnieuw worden geselecteerd.',
    },
  }[currentLanguage];

  if (!shareNotice && !photoRequiresReselection) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900" role="status" aria-live="polite">
      {photoRequiresReselection ? locale.reselect : shareNotice}
    </div>
  );
}
