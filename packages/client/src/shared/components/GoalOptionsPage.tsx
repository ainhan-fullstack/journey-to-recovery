import { Link } from "react-router-dom";
import { Target, Lightbulb } from "lucide-react";

const LinkButton = ({
  to,
  text,
  Icon,
}: {
  to: string;
  text: string;
  Icon: React.ElementType;
}) => (
  <Link
    to={to}
    className="flex items-center w-full p-4 space-x-4 bg-white rounded-lg border border-gray-300 hover:bg-gray-50"
  >
    <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
      <Icon className="h-8 w-8 text-gray-700" />
    </div>
    <span className="flex-grow text-left text-lg font-medium text-gray-800">
      {text}
    </span>
  </Link>
);

export default function GoalOptionsPage() {
  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-6 mt-8">
            <LinkButton
              to="/existing-goal"
              text="I have a goal and want to make it..."
              Icon={Target}
            />
            <LinkButton
              to="/strengths-intro"
              text="I'd like to set a new goal"
              Icon={Lightbulb}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
