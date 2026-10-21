type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.36A20 20 0 0 0 14.13 4.2c-2.3 0-3.88 1.4-3.88 3.98v2.32H8v3h2.25V21h3.25z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H3.56V20.5h3.38zm-1.69-5.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.44 20.5v-6.56c0-3.51-1.87-5.14-4.37-5.14-2.01 0-2.91 1.1-3.41 1.88V8.5H9.28c.04.96 0 12 0 12h3.38v-6.7c0-.36.03-.72.13-.98.29-.72.95-1.47 2.06-1.47 1.45 0 2.03 1.1 2.03 2.72v6.43z" />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.5 6.1c-.6.27-1.25.46-1.93.54a3.36 3.36 0 0 0 1.48-1.86 6.72 6.72 0 0 1-2.13.81 3.35 3.35 0 0 0-5.71 3.05 9.5 9.5 0 0 1-6.9-3.5 3.35 3.35 0 0 0 1.04 4.47 3.32 3.32 0 0 1-1.52-.42v.04a3.35 3.35 0 0 0 2.69 3.29 3.4 3.4 0 0 1-1.51.06 3.36 3.36 0 0 0 3.13 2.33A6.73 6.73 0 0 1 3 16.4a9.47 9.47 0 0 0 5.14 1.51c6.17 0 9.54-5.11 9.54-9.54v-.44a6.8 6.8 0 0 0 1.67-1.74z" />
    </svg>
  );
}
