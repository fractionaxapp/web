'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** One client island for the whole deals table body. The per-row "Register
 * on-chain" buttons are plain server-rendered HTML (with `data-deal-id`); this
 * wrapper handles clicks via event delegation, so a 40-row table costs ONE client
 * component instead of 40 (which is what made the admin deals page slow to render). */
export function RegisterRows({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent<HTMLTableSectionElement>): Promise<void> {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-deal-id]');
    if (!btn || busy) return;
    const dealId = btn.dataset.dealId;
    if (!dealId) return;

    setBusy(true);
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Registering…';
    try {
      const res = await fetch('/api/admin/deal/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dealId }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        btn.textContent = 'registered ✓';
        router.refresh();
      } else {
        btn.textContent = original;
        btn.disabled = false;
        btn.title = data.error ?? 'Registration failed';
      }
    } catch {
      btn.textContent = original;
      btn.disabled = false;
      btn.title = 'Couldn’t reach the server';
    } finally {
      setBusy(false);
    }
  }

  return (
    <tbody className="divide-y" onClick={onClick}>
      {children}
    </tbody>
  );
}
