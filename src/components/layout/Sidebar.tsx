
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Tag,
  BarChart3,
  Users,
  Settings,
  Scan,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role_id === 1;

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: 'POS',
      href: '/pos',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: 'Products',
      href: '/products',
      icon: <Package className="w-5 h-5" />,
      adminOnly: true,
    },
    {
      title: 'Categories',
      href: '/categories',
      icon: <Tag className="w-5 h-5" />,
      adminOnly: true,
    },
    {
      title: 'Orders',
      href: '/orders',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: <BarChart3 className="w-5 h-5" />,
      adminOnly: true,
    },
    {
      title: 'Users',
      href: '/users',
      icon: <Users className="w-5 h-5" />,
      adminOnly: true,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
      adminOnly: true,
    },
  ];

  return (
    <aside
      className={cn(
        'bg-white border-r border-border transition-all duration-300 ease-in-out h-screen flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex items-center justify-center border-b border-border h-16">
        {collapsed ? (
          <Scan className="h-8 w-8 text-primary" />
        ) : (
          <div className="flex items-center">
            <Scan className="h-8 w-8 mr-2 text-primary" />
            <h1 className="text-xl font-bold text-primary">QuickScan</h1>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            // Skip admin-only items for non-admin users
            if (item.adminOnly && !isAdmin) {
              return null;
            }
            
            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center py-2 px-3 rounded-md text-sm transition-colors',
                      collapsed ? 'justify-center' : '',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-secondary hover:bg-muted'
                    )
                  }
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div
          className={cn(
            'rounded-md bg-muted p-3',
            collapsed ? 'flex justify-center' : ''
          )}
        >
          <Scan className="h-5 w-5 text-muted-foreground" />
          {!collapsed && (
            <div className="ml-3 text-xs text-muted-foreground">
              <p>QuickScan POS</p>
              <p>v1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
