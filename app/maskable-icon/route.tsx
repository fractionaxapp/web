import { ImageResponse } from 'next/og';

// 512px maskable icon for PWA installs — full-bleed teal so the platform mask
// (circle/squircle) never clips a transparent corner; the "f" lettermark sits in
// the central safe zone.
export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#16af8e',
        }}
      >
        <svg width="131" height="310" viewBox="0 102 101 239" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ffffff"
            d="M39.76,166.11v4.42h46.39v34.39h-46.39v136.01H0v-187.75c0-31.56,21.77-51.44,53.01-51.44h47.96v36.29h-33.13c-21.46,0-28.09,8.52-28.09,28.09Z"
          />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
