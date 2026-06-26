import { PortfolioView } from '@/components/portfolio-view';
import { RequireAuth } from '@/components/require-auth';

export const metadata = { title: 'Portfolio' };

export default function PortfolioPage() {
  return (
    <RequireAuth>
      <main id="main" className="px-safe max-w-3xl py-12">
        <h1 className="font-mono uppercase text-2xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Your positions, projected yield, and risk concentration.
        </p>
        <PortfolioView />
      </main>
    </RequireAuth>
  );
}
