import { PageHeader } from '@/components/page-header';
import { PortfolioView } from '@/components/portfolio-view';
import { RequireAuth } from '@/components/require-auth';

export const metadata = { title: 'Portfolio' };

export default function PortfolioPage() {
  return (
    <RequireAuth>
      <main id="main" className="px-safe mx-auto max-w-5xl py-12">
        <PageHeader
          kicker="Holdings"
          title="Portfolio"
          description="Your positions, projected yield, and risk concentration."
        />
        <PortfolioView />
      </main>
    </RequireAuth>
  );
}
