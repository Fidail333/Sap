import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
