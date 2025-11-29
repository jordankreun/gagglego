import { Link } from 'react-router-dom';
import { Bird, LogOut, User, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { GaggleGoWordmark } from '@/components/GaggleGoWordmark';
import { NavLink } from '@/components/NavLink';
import { NotificationCenter } from '@/components/NotificationCenter';
import { InstallButton } from '@/components/InstallButton';

export const Navigation = () => {
  const {
    user,
    signOut
  } = useAuth();
  return <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 bg-primary-foreground">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/plan" className="flex items-center">
              <GaggleGoWordmark size="sm" animate={false} />
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center gap-6">
                <NavLink 
                  to="/plan" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                >
                  Plan Trip
                </NavLink>
                <NavLink 
                  to="/trips" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                >
                  My Migrations
                </NavLink>
              </div>
            )}
          </div>

          {/* Install, Notification Bell & User Menu */}
          <div className="flex items-center gap-2">
            <InstallButton showBadge />
            {user && <NotificationCenter />}
            {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">{user.user_metadata?.display_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/plan" className="cursor-pointer">
                    <Bird className="mr-2 h-4 w-4" />
                    Plan Trip
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trips" className="cursor-pointer">
                    <Bird className="mr-2 h-4 w-4" />
                    My Migrations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Link to="/auth">
              <Button variant="accent" size="sm">
                Join
              </Button>
            </Link>}
          </div>
        </div>
      </div>
    </nav>;
};