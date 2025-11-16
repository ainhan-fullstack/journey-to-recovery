import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

export default function ExistingGoalPage() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");

  const handleContinue = () => {
    navigate("/smart-goal", { state: { goal } });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden">
        <div className="bg-white p-6 flex flex-col flex-grow">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-800">
              What do you want to achieve?
            </h1>
            <p className="text-gray-600 text-lg">
              You've indicated that you already have a goal in mind.
            </p>
            <p className="text-gray-600 text-lg">
              Let's explore your goal and help you to make your goal achievable.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              What would you like to achieve?
            </h2>
            <Textarea
              placeholder="Enter text..."
              className="min-h-[150px] text-lg rounded-xl"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
              disabled={!goal}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
