import { Copilot } from '@/components/copilot';

export const metadata = { title: 'Copilot' };

export default function CopilotPage() {
  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Copilot</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Describe what you want to invest in. The agent parses your intent, sources matching deals,
        and drafts an investment memo — streamed back as each step completes.
      </p>
      <div className="mt-6">
        <Copilot autoFocus />
      </div>
    </main>
  );
}
