import { ChevronRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExploreItemProps {
  title: string;
  link: string;
}

const LogoPlaceholder = () => (
  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
    <Heart className="h-6 w-6 text-gray-500" />
  </div>
);

const ExploreItem = ({ title, link }: ExploreItemProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  }
  return (
    <button onClick={handleClick} className="flex items-center w-full p-4 space-x-4 border-b border-gray-200 hover:bg-gray-50">
      <LogoPlaceholder />
      <span className="flex-grow text-left text-lg font-medium text-gray-800">
        {title}
      </span>
      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
    </button>
  )
}

export default ExploreItem