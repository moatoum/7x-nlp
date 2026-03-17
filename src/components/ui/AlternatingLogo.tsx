'use client';

import { LocaleLink } from '@/components/ui/LocaleLink';
import { Logo } from '@/components/ui/Logo';

export function AlternatingLogo() {
  return (
    <LocaleLink href="/" className="flex items-center">
      <div className="w-8 h-8 rounded-[10px] bg-black flex items-center justify-center">
        <Logo className="w-[20px] h-[12px]" color="white" />
      </div>
    </LocaleLink>
  );
}
