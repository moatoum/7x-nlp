'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/LocaleProvider';
import type { ComponentProps } from 'react';

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * Wraps Next.js Link to auto-prefix /{locale} on internal paths.
 * External URLs and anchor links are passed through unchanged.
 */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { locale } = useTranslation();

  let resolvedHref = href;
  if (href.startsWith('/') && !href.startsWith(`/${locale}/`) && href !== `/${locale}`) {
    resolvedHref = `/${locale}${href}`;
  }

  return <Link href={resolvedHref} {...props} />;
}
