import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { Loader2 } from 'lucide-react';

export function AdminLayout() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-16 lg:pt-8 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
