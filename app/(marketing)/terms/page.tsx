export const metadata = {
  title: 'Terms of Use',
  description: 'The terms for using the FractionAX prototype.',
};

const SECTIONS = [
  {
    h: '1. Acceptance',
    p: 'By accessing or using FractionAX (the “Service”), you agree to these Terms of Use. If you do not agree, do not use the Service.',
  },
  {
    h: '2. Prototype on devnet',
    p: 'FractionAX is an early-stage prototype running on Solana devnet. It is provided for demonstration and evaluation only. No real funds move, tokens have no monetary value, and any figures shown (yields, valuations, balances) are illustrative.',
  },
  {
    h: '3. Not financial advice',
    p: 'Nothing on the Service is financial, investment, legal, or tax advice, nor an offer or solicitation to buy or sell any security or asset. Agent-generated memos and valuations are automated outputs and may be incomplete or wrong. Do your own research and consult a qualified professional before making real-world decisions.',
  },
  {
    h: '4. Your account',
    p: 'Browsing deals and on-chain data requires no account. To use the Copilot or a portfolio you sign in through our authentication provider (email, Google, X, or a Solana wallet). You are responsible for your account, your wallet, and safeguarding your keys.',
  },
  {
    h: '5. Agents propose, you approve',
    p: 'FractionAX agents surface options and prepare transactions; they never move funds or custody assets without your consent. Reviewing, approving, and signing any transaction is your decision and your responsibility.',
  },
  {
    h: '6. Acceptable use',
    p: 'Do not use the Service for unlawful purposes, attempt to disrupt or attack it, abuse the agents or APIs, or misrepresent your identity. We may suspend access that threatens the Service or other users.',
  },
  {
    h: '7. No warranty',
    p: 'The Service is provided “as is” and “as available”, without warranties of any kind. As experimental software it may change, break, lose data, or be discontinued at any time without notice.',
  },
  {
    h: '8. Limitation of liability',
    p: 'To the maximum extent permitted by law, FractionAX and its contributors are not liable for any loss or damage arising from your use of the Service. Because this is a devnet prototype, you should not place real-world reliance or value on it.',
  },
  {
    h: '9. Changes',
    p: 'We may update these terms as the project evolves. Continued use after changes means you accept the updated terms.',
  },
  {
    h: '10. Contact',
    p: 'Questions about these terms? Email hello@fractionax.app.',
  },
];

export default function TermsPage() {
  return (
    <main id="main" className="px-safe mx-auto max-w-3xl py-16">
      <p className="text-sm font-medium text-primary">Legal</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 26 June 2026</p>

      <p className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        This is a plain-language placeholder for an early prototype, not legal advice. Replace it
        with reviewed terms before any production launch or handling of real funds.
      </p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h} className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">{s.h}</h2>
            <p className="leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
