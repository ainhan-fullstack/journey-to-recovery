import { Home, BookOpen, User } from "lucide-react";

export function NavBar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <button className="flex flex-col items-center text-blue-600 space-y-1">
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 space-y-1">
          <BookOpen className="h-6 w-6" />
          <span className="text-xs font-medium">Explore</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 space-y-1">
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">Me</span>
        </button>
      </nav>
    </header>
  );
}
