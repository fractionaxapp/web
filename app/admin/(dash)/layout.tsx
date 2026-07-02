import { redirect } from 'next/navigation';

import { AdminNav } from '@/components/admin-nav';
import { getAdminSession } from '@/lib/admin-auth';

export const metadata = { title: 'Admin' };
// Session must be checked on every request, never statically cached.
export const dynamic = 'force-dynamic';

/** Gate for every admin dashboard route (everything under /admin except /admin/login,
 * which sits outside this route group). Unauthenticated requests are redirected to
 * the login page before any admin data is fetched or rendered. */
export default async function AdminDashLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav email={session.email} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
