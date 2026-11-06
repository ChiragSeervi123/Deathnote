/** Minimal line icons, drawn for this project. All are decorative (aria-hidden). */

export function NotebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 20 26" aria-hidden="true" focusable="false">
      <rect x="2.5" y="1.5" width="15" height="23" fill="#0b0b0b" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2.5" y="1.5" width="2.6" height="23" fill="currentColor" opacity="0.28" />
      <path d="M7.5 9h7M7.5 12.5h5" stroke="currentColor" strokeWidth="1" />
      <path d="M7.5 18h6" stroke="#c92a32" strokeWidth="1.2" />
    </svg>
  );
}

export function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d="M2.5 6.8h3L9.5 3.5v11l-4-3.3h-3z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {on ? (
        <>
          <path d="M12 6.3a3.6 3.6 0 0 1 0 5.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M14 4.3a6.4 6.4 0 0 1 0 9.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </>
      ) : (
        <path d="M12 6.5l4 5M16 6.5l-4 5" stroke="currentColor" strokeWidth="1.2" />
      )}
    </svg>
  );
}

export function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M7 12V2M2.5 6.5L7 2l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
