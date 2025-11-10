import { Button } from "@/components/ui/button";
import { Home, BookOpen, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavBar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <NavLink to={"/"}>
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center space-y-1 h-auto p-2 cursor-pointer",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs font-medium">Home</span>
            </Button>
          )}
        </NavLink>
        <NavLink to={"/explore"}>
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center space-y-1 h-auto p-2 cursor-pointer",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-xs font-medium">Explore</span>
            </Button>
          )}
        </NavLink>
        <NavLink to={"/profile"}>
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center space-y-1 h-auto p-2 cursor-pointer",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Me</span>
            </Button>
          )}
        </NavLink>
      </nav>
    </header>
  );
}
