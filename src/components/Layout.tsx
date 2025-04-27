
import React from 'react';
import { Smartphone, FileText, User, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">TanzaPay Community</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-2">
        <div className="flex justify-around items-center">
          <NavLink to="/" icon={<Home />} label="Home" active={location.pathname === '/'} />
          <NavLink to="/contribute" icon={<Smartphone />} label="Pay" active={location.pathname === '/contribute'} />
          <NavLink to="/reports" icon={<FileText />} label="Reports" active={location.pathname === '/reports'} />
          <NavLink to="/profile" icon={<User />} label="Profile" active={location.pathname === '/profile'} />
        </div>
      </nav>
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
