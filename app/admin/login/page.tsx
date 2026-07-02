'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, accessKey }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Sign-in failed.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Couldn’t reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <Logo className="h-7" />
          <span className="kicker text-primary">Admin</span>
        </div>
        <Card>
          <CardContent className="p-6">
            <h1 className="font-serif text-xl font-semibold tracking-tight">Super-admin sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Team access only. Use your allowlisted email and the team access key.
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <div>
                <label htmlFor="admin-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@fractionax.app"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-key" className="text-sm font-medium">
                  Access key
                </label>
                <Input
                  id="admin-key"
                  type="password"
                  autoComplete="current-password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                  required
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
