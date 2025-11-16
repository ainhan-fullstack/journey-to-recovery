import ExploreItem from "./ExploreItem";
import SearchBar from "./SearchBar";

const exploreItems = [
  { title: "Living Your Best Life Post-Stroke", link: "/welcome" },
  { title: "Getting Started", link: "/goal-options" },
  { title: "How to use Journey to Recovery", link: "/welcome" },
  { title: "Create a new SMART goal", link: "/existing-goal" },
  { title: "Create a new overall goal and ma...", link: "/strengths-intro" },
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
            <ExploreItem key={index} title={item.title} link={item.link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
