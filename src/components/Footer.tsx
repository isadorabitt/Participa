import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { FOOTER_LINKS, FOOTER_ADDRESS, SOCIAL_LINKS } from '@/config';
import { AccessibilityButtons } from '@/components/AccessibilityButtons';
import { cn } from '@/lib/utils';

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
};

export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-participa-blue/20 bg-[#0a1628] text-white"
      role="contentinfo"
    >
      <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Links do rodapé" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <AccessibilityButtons variant="footer" />
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path + link.label}>
                  <Link
                    to={link.path}
                    className="text-white transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICON_MAP[social.iconName];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-white transition-all hover:scale-105 hover:bg-white/15 hover:text-white',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]'
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                </a>
              );
            })}
          </div>
        </div>
        <p className="mt-6 text-sm text-white">
          {FOOTER_ADDRESS.text}
        </p>
        <p className="mt-2 text-xs text-white">
          © {new Date().getFullYear()} Participa DF
        </p>
      </div>
    </footer>
  );
}
