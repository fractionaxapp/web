import { ImageResponse } from 'next/og';

// Social-share card for every link to the site. Brand: forest field, teal mark,
// gold accent. Rendered from the brand palette — no asset dependency.
export const alt = 'FractionAX — Agentic RWA investing on Solana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(135deg, #0b1411 0%, #122019 55%, #163d31 100%)',
          color: '#f6f6f6',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
              background: '#16af8e',
            }}
          >
            <svg width="22" height="52" viewBox="0 102 101 239" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#ffffff"
                d="M39.76,166.11v4.42h46.39v34.39h-46.39v136.01H0v-187.75c0-31.56,21.77-51.44,53.01-51.44h47.96v36.29h-33.13c-21.46,0-28.09,8.52-28.09,28.09Z"
              />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>FractionAX</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              maxWidth: 940,
            }}
          >
            Invest in real-world assets by describing what you want
          </div>
          <div style={{ fontSize: 32, color: '#9fb5ad' }}>Agentic RWA investing on Solana</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: '#cde7df' }}>
          <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 999, background: '#f9b73f' }} />
          <div>staging.fractionax.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
