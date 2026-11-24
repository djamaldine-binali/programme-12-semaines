export function OtterMark({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M30 70c-4 10-6 18-6 26h52c0-8-2-16-6-26z" fill="var(--otter)" />
      <path d="M38 66c-2 10-3 19-3 30h30c0-11-1-20-3-30z" fill="var(--otter-bib)" />
      <circle cx="17" cy="38" r="7" fill="var(--otter)" />
      <circle cx="83" cy="38" r="7" fill="var(--otter)" />
      <circle cx="17.5" cy="38.5" r="3" fill="var(--muzzle)" />
      <circle cx="82.5" cy="38.5" r="3" fill="var(--muzzle)" />
      <path d="M50 22c23 0 37 12 37 29 0 17-15 27-37 27S13 68 13 51c0-17 14-29 37-29z" fill="var(--otter)" />
      <path d="M50 52c-5-4-15-4-19 2-4 7 3 18 19 18s23-11 19-18c-4-6-14-6-19-2z" fill="var(--otter-bib)" />
      <path
        d="M33 42a3.2 3.2 0 1 1 6.4 0M60.6 42a3.2 3.2 0 1 1 6.4 0"
        fill="none"
        stroke="#2e2b29"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M44.5 52.5c0-1.8 2.4-2.6 5.5-2.6s5.5.8 5.5 2.6c0 2.2-3 4.4-5.5 4.4s-5.5-2.2-5.5-4.4z"
        fill="var(--muzzle-dark)"
      />
      <path
        d="M50 57v3M41.5 59.5c2.8 3.6 6.2 3.6 8.5.4 2.3 3.2 5.7 3.2 8.5-.4"
        fill="none"
        stroke="var(--muzzle-dark)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="var(--muzzle)">
        <circle cx="38" cy="58" r="1" />
        <circle cx="35" cy="61" r="1" />
        <circle cx="62" cy="58" r="1" />
        <circle cx="65" cy="61" r="1" />
      </g>
    </svg>
  )
}
