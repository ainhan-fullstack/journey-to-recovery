// src/pages/SmartGoalFormIntroPage.tsx
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function SmartGoalFormIntroPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const goal = location.state?.goal;

  const handleContinue = () => {
    navigate("/smart-goal-form", { state: { goal } });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Your SMART Goal
            </h1>
            <p className="text-gray-600 text-lg">
              Now it’s time for you to create your own SMART goal.
            </p>
            <p className="text-gray-600 text-lg">
              Look at your overall goal and think about how you could break this
              down into a{" "}
              <strong className="font-semibold">
                Specific, Measurable, Achievable, Relevant, and Time-Bound
              </strong>{" "}
              goal. Some people find it helpful to get a friend, family member,
              or health professional to help them to write their SMART goal.
            </p>
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
