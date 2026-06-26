import { ImageResponse } from 'next/og';

// iOS home-screen icon. Full-bleed teal (iOS applies its own rounded mask) with
// the brand initial. Placeholder until a square mark is exported.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 116,
          fontWeight: 700,
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
