import { money } from '@fractionax/core';
import { Button } from '@fractionax/ui';

const MIN_INVESTMENT = money(10_000, 'USD');

export default function HomePage() {
  const minDollars = MIN_INVESTMENT.amount / 100;

  return (
    <main className="container">
      <h1>FractionAX</h1>
      <p>
        Fractional ownership, starting at ${minDollars.toLocaleString()} {MIN_INVESTMENT.currency}.
      </p>
      <Button variant="primary">Get started</Button>
    </main>
  );
}
