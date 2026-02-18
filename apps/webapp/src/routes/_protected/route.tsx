import {
  createFileRoute,
  Outlet,
  Link,
  Navigate,
  type LinkProps,
  useLocation,
} from '@tanstack/react-router';
import { Menu, User, LayoutDashboard, Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
});

interface SidebarLink extends LinkProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const DEFAULT_LINKS: SidebarLink[] = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { to: '/myEvents', label: 'Mis Eventos', icon: LayoutDashboard },
  { to: '/new', label: 'Nuevo Evento', icon: Plus },
];

function RouteComponent() {
  const { data } = authClient.useSession();

  if (!data) return <Navigate to="/login" replace />;

  return (
    <AppLayout
      links={DEFAULT_LINKS}
      userName={data.user.name}
      userEmail={data.user.email}
    >
      <Outlet />
    </AppLayout>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
  links: SidebarLink[];
  userName: string;
  userEmail: string;
}

function AppLayout({ children, links, userName, userEmail }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = Route.useNavigate();
  const location = useLocation();
  const {
    logOut: { mutate: logOutMutation, isPending: logOutPending },
  } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logOutMutation(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' });
      },
      onError: (error) => {
        console.error('Logout failed:', error);
      },
    });
  };

  return (
    <div className="flex min-h-screen w-dvw flex-col bg-muted/40">
      <header className="bg-background sticky py-2 top-0 z-30 flex h-16 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-semibold">
                EventManager
              </SheetTitle>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium pt-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-foreground text-muted-foreground flex items-center gap-4 px-2.5 transition-colors"
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <span className="font-bold sm:inline-block">EventManager</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-sm font-medium sm:inline-block">
            {userName}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{userName}</DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground text-xs">
                {userEmail}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button disabled={logOutPending} onClick={handleLogout}>
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="grid flex-1 p-4 sm:px-6 sm:py-0">
        <div className="max-w-4xl w-full mx-auto py overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
