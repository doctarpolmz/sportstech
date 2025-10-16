import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  Home, Video, MessageSquare, Calendar, 
  Users, Layout as LayoutIcon, LogOut 
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl text-primary-foreground font-bold">ST</span>
            </div>
            <h1 className="text-2xl font-bold">SportsTech AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/videos">
            <Button variant="ghost" className="w-full justify-start">
              <Video className="mr-2 h-5 w-5" />
              My Videos
            </Button>
          </Link>
          
          <Link to="/messages">
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="mr-2 h-5 w-5" />
              Messages
            </Button>
          </Link>
          
          <Link to="/schedule">
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule
            </Button>
          </Link>
          
          {user?.role === 'coach' && (
            <>
              <Link to="/coach">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-5 w-5" />
                  My Athletes
                </Button>
              </Link>
              
              <Link to="/lineup">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutIcon className="mr-2 h-5 w-5" />
                  Lineup Designer
                </Button>
              </Link>
            </>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
