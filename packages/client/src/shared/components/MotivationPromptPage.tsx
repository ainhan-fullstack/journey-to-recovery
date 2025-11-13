import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function MotivationPromptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);

  const { overallGoal, smartGoal } = location.state || {};

  if (!smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    if (selection === "yes") {
      navigate("/importance-ruler", {
        state: {
          overallGoal,
          smartGoal,
        },
      });
    } else {
      navigate("/goal-summary", { state: { overallGoal, smartGoal } });
    }
  };

  return (
    // 1. Page container
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Would you like to explore your motivation to achieve your goal?
            </h1>
          </div>

          <div className="space-y-6 mt-12">
            <Button
              variant="outline"
              onClick={() => setSelection("yes")}
              className={cn(
                "w-full h-auto p-4 justify-start text-lg rounded-xl border-gray-300",
                "hover:bg-blue-50",
                selection === "yes" &&
                  "border-blue-600 border-2 bg-blue-50 text-blue-700"
              )}
            >
              Yes
            </Button>

            <Button
              variant="outline"
              onClick={() => setSelection("no")}
              className={cn(
                "w-full h-auto p-4 justify-start text-lg rounded-xl border-gray-300",
                "hover:bg-blue-50",
                selection === "no" &&
                  "border-blue-600 border-2 bg-blue-50 text-blue-700"
              )}
            >
              No
            </Button>
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
              disabled={!selection}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
