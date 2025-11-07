import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";

interface UserHeaderProps {
  name: string;
  progress: number;
}

export function UserHeader({ name, progress }: UserHeaderProps) {
  return (
    <section className="flex items-center space-x-3">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-gray-300">
          <User className="h-6 w-6 text-gray-600" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <span className="font-semibold text-gray-800">{name}</span>
        <Progress value={progress} className="h-1 w-full mt-1" />
      </div>
    </section>
  );
}