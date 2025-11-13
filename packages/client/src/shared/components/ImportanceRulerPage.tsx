import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNavigate, useLocation } from "react-router-dom";

const valueLabels = [
  "0 - Not at all important",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10 - Extremely important",
];

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function ImportanceRulerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [importance, setImportance] = useState([0]);

  const { overallGoal, smartGoal } = location.state || {};

  if (!smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    navigate("/importance-result", {
      state: {
        overallGoal,
        smartGoal,
        importance: importance[0],
      },
    });
  };

  return (
    // 1. Page container
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Importance Ruler
            </h1>
            <p className="text-gray-600 text-lg">
              The importance ruler will help to identify how important the goal
              is to you.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            <h2 className="text-xl font-semibold text-blue-800">
              How important is this goal to you?
            </h2>
            <p className="text-gray-600 text-lg">
              Rate the importance from 0 (not important at all) to 10 (extremely
              important)
            </p>

            <div className="text-center text-lg font-semibold text-blue-800 pt-4">
              {valueLabels[importance[0]]}
            </div>

            <div className="pt-6 px-2">
              <Slider
                value={importance}
                onValueChange={setImportance}
                max={10}
                step={1}
                className="w-full"
              />

              <div className="flex justify-between text-sm text-gray-700 mt-2">
                {numbers.map((num) => (
                  <span key={num} className="w-4 text-center">
                    {num}
                  </span>
                ))}
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="text-left max-w-[40%] leading-tight">
                  0 - Not at all important
                </span>
                <span className="text-right max-w-[40%] leading-tight">
                  10 - Extremely important
                </span>
              </div>
            </div>
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
