// ============================================================================
// ENUX - Header Component
// ============================================================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUnreadNotificationCount } from '@/hooks/queries';
import {
  Search,
  GitBranch,
  Star,
  Bell,
  Settings,
  User,
  Plus,
  Home,
  Users,
  BookOpen,
  MessageCircle,
  LogOut,
} from 'lucide-react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: unreadCount } = useUnreadNotificationCount();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/repositories', label: 'Repositories', icon: BookOpen },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/ai-assistant', label: 'AI Assistant', icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Enux</span>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </Link>

          {/* Main Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    size="sm"
                    className="text-sm"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search repositories, templates, collaborators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary"
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* New Repository Button */}
              <Link to="/repositories/new">
                <Button variant="professional" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Repository</span>
                </Button>
              </Link>

              <div className="flex items-center space-x-1 ml-2">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>

                {/* Starred */}
                <Link to="/repositories?filter=starred">
                  <Button variant="ghost" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Settings */}
                <Link to="/settings">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.displayName?.split(' ').map((n) => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium">{user?.displayName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/users/${user?.id}`} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Your Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/repositories" className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Your Repositories
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/repositories?filter=starred" className="cursor-pointer">
                        <Star className="mr-2 h-4 w-4" />
                        Starred
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="premium" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
