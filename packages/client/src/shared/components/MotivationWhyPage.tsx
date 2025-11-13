import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";

export default function MotivationWhyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [motivation, setMotivation] = useState("");

  const { overallGoal, smartGoal, importance } = location.state || {};

  if (importance === undefined) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    navigate("/confidence-intro", {
      state: {
        overallGoal,
        smartGoal,
        importance,
        motivation,
      },
    });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="h-2 w-full bg-teal-400" />

        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Why is your goal important to you?
            </h1>
            <p className="text-gray-600 text-lg">
              It's easy to lose motivation when things are tough.
            </p>
            <p className="text-gray-600 text-lg">
              Focusing on why your goal is important to you can help to overcome
              this.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              Enter your reasons here about why your goal is important.
            </h2>
            <Textarea
              placeholder="Enter text ..."
              className="min-h-[150px] text-lg rounded-xl"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
              disabled={!motivation}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
