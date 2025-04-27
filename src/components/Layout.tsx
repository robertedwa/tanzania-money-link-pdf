
import React from 'react';
import { Smartphone, FileText, User, Home, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const Layout = ({ children, requireAuth = true }: LayoutProps) => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isLoading && !user && requireAuth) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate, requireAuth]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user && requireAuth) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">TanzaPay Community</h1>
          {user && (
            <Button variant="ghost" className="text-white" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        {children}
      </main>

      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-2">
          <div className="flex justify-around items-center">
            <NavLink to="/" icon={<Home />} label="Home" active={location.pathname === '/'} />
            <NavLink to="/contribute" icon={<Smartphone />} label="Pay" active={location.pathname === '/contribute'} />
            <NavLink to="/reports" icon={<FileText />} label="Reports" active={location.pathname === '/reports'} />
            <NavLink to="/profile" icon={<User />} label="Profile" active={location.pathname === '/profile'} />
          </div>
        </nav>
      )}
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavLink = ({ to, icon, label, active }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center p-2 rounded-md transition-colors",
        active ? "text-primary" : "text-gray-500"
      )}
    >
      <span className={active ? "text-primary" : "text-gray-500"}>
        {icon}
      </span>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};
