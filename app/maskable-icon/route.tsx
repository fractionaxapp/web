import { ImageResponse } from 'next/og';

// 512px maskable icon for PWA installs — full-bleed teal so the platform mask
// (circle/squircle) never clips a transparent corner; the mark sits in the safe
// zone. Placeholder until the real square mark is exported.
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
          color: '#ffffff',
          fontSize: 300,
          fontWeight: 700,
        }}
      >
        F
      </div>
    ),
    { width: 512, height: 512 },
  );
}
