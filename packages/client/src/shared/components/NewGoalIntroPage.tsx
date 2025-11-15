import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";

export default function NewGoalIntroPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [overallGoal, setOverallGoal] = useState("");

  const { focusArea } = location.state || {};

  if (!focusArea) {
    navigate("/wellness-summary");
    return null;
  }

  const handleContinue = () => {
    navigate("/smart-goal");
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              What would you like to achieve?
            </h1>
            <p className="text-gray-600 text-lg">
              Now that you've identified what area of your life you would like
              to focus on, let's get started on setting a goal for you to work
              towards.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              Your chosen area of focus is {focusArea}
            </h2>
            <p className="text-gray-600 text-lg">
              Write down what you would like to achieve in your chosen area of
              focus. In the next part, we'll help you break this down into
              smaller activities to help you to build towards your goal.
            </p>
            <Textarea
              placeholder="Enter text ..."
              className="min-h-[150px] text-lg rounded-xl"
              value={overallGoal}
              onChange={(e) => setOverallGoal(e.target.value)}
            />
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
              disabled={!overallGoal}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
