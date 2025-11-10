import ExploreItem from "./ExploreItem";
import SearchBar from "./SearchBar";

const exploreItems = [
  { title: "Living Your Best Life Post-Stroke" },
  { title: "Getting Started" },
  { title: "How to use Journey to Recovery" },
  { title: "Create a new SMART goal" },
  { title: "Create a new overall goal and ma..." },
];

const ExplorePage = () => {
  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4.2rem)]">
      <div className="w-full max-w-md">
        <div className="p-4 sticky top-0 bg-orange-50 z-10">
          <SearchBar />
        </div>

        <div className="bg-white">
          {exploreItems.map((item, index) => (
            <ExploreItem key={index} title={item.title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
