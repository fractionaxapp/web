import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { DashboardNav } from '@/components/dashboard-nav';

export const metadata: Metadata = {
  title: { default: 'FractionAX', template: '%s — FractionAX' },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="md:flex md:min-h-dvh">
      <DashboardNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
