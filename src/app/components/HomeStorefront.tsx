'use client';

import StorefrontHero from './StorefrontHero';
import CardCatalog from './CardCatalog';
import EditorialSections from './EditorialSections';
import { useStorefrontLanguage } from './StorefrontShell';

export default function HomeStorefront() {
  const language = useStorefrontLanguage();

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 pb-12">
      <StorefrontHero currentLanguage={language} />
      <CardCatalog showCategoryNavigation headingLevel={2} />
      <EditorialSections currentLanguage={language} />
    </div>
  );
}
