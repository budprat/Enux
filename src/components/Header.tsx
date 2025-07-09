import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle
} from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Enux</span>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="text-sm">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Repositories
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Users className="h-4 w-4 mr-2" />
              Community
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search repositories, templates, collaborators..."
              className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="professional" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </Button>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}