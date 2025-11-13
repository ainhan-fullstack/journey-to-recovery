import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Target } from "lucide-react";

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

export default function ImportanceResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { overallGoal, smartGoal, importance } = location.state || {};

  if (importance === undefined) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    navigate("/motivation-why", {
      state: {
        overallGoal,
        smartGoal,
        importance,
      },
    });
  };

  const renderContent = () => {
    if (importance === 0) {
      return (
        <>
          <p className="text-gray-700 text-lg">
            You scored the importance of your goal as 0 – this goal is not at
            all important. If you would like to change your goal and set a new
            SMART goal. Or simply click 'Next' to continue.
          </p>
          <div className="mt-6">
            <LinkButton
              to="/create-goal"
              text="I have a goal and want to..."
              Icon={Target}
            />
          </div>
        </>
      );
    }

    return (
      <p className="text-gray-700 text-lg">
        You scored the importance of your goal as {importance}. Click 'Next' to
        continue.
      </p>
    );
  };

  return (
    <div className="flex flex-col items-center bg-orange-50 min-h-[calc(100vh-4rem)]">
      <div className="w-full bg-teal-200 p-8 text-center">
        <p className="text-teal-800 text-sm font-medium border-b border-teal-800 inline-block pb-1">
          Importance Ruler - Already have a goal
        </p>
        <h1 className="text-3xl font-bold text-teal-900 mt-4">
          Score {importance}
        </h1>
      </div>

      <div className="w-full max-w-md p-6 flex flex-col flex-grow">
        <div className="space-y-4">{renderContent()}</div>

        <div className="flex-grow" />

        <div className="pt-6 mt-8">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
            onClick={handleContinue}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
