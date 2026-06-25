import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The page itself is a Client Component and can't export metadata, so the title
// for /copilot lives here.
export const metadata: Metadata = {
  title: 'Copilot — FractionAX',
};

export default function CopilotLayout({ children }: { children: ReactNode }) {
  return children;
}
