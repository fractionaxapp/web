export const metadata = {
  title: 'Privacy Policy',
  description: 'What data the FractionAX prototype collects and how it is used.',
};

const SECTIONS = [
  {
    h: 'What we collect',
    p: 'Minimal data. When you sign in, our authentication provider gives us an identifier — your email address or your Solana wallet address. We store your theme preference in your browser’s local storage, and the Service keeps basic technical logs (e.g. error and request data). On devnet there is no real financial or payment information.',
  },
  {
    h: 'How we use it',
    p: 'We use this data only to authenticate you, keep you signed in, and provide the app — for example, running the Copilot on your prompts and showing your session. We do not use it for advertising.',
  },
  {
    h: 'Third parties',
    p: 'We rely on a few providers: an authentication provider (to sign you in), a hosting provider (to serve the site), and the FractionAX agents service (which processes your Copilot prompts to generate results). Solana is a public blockchain — wallet addresses and on-chain activity are inherently public and not controlled by us.',
  },
  {
    h: 'Cookies & local storage',
    p: 'We use local storage for your theme choice and session. We do not use advertising or cross-site tracking cookies.',
  },
  {
    h: 'Data sharing',
    p: 'We do not sell your data. We share it only with the providers above, as needed to run the Service, or where required by law.',
  },
  {
    h: 'Your choices',
    p: 'You can sign out at any time, clear your browser’s local storage to remove preferences and session, and email us to request deletion of account data we hold.',
  },
  {
    h: 'Contact',
    p: 'Questions about privacy? Email hello@fractionax.app.',
  },
];

export default function PrivacyPage() {
  return (
    <main id="main" className="px-safe mx-auto max-w-3xl py-16">
      <p className="text-sm font-medium text-primary">Legal</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 26 June 2026</p>

      <p className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        This is a plain-language placeholder for an early devnet prototype, not legal advice.
        Replace it with a reviewed policy before any production launch.
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
