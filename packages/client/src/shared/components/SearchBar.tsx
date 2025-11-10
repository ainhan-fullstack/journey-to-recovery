import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Search"
        className="pl-10 h-12 bg-white border-gray-300 rounded-lg text-base"
      />
    </div>
  );
};

export default SearchBar;
