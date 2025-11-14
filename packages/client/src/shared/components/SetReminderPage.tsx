import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SetReminderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);

  const allGoalData = location.state || {};

  if (!allGoalData.smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    if (!selection) navigate("/getting-started");

    if (selection === "yes") {
      navigate("/reminder-schedule", { state: allGoalData });
    } else {
      navigate("/goal-final-summary", {
        state: {
          ...allGoalData,
          reminderType: "none",
        },
      });
    }
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Would you like to set a reminder?
            </h1>
            <p className="text-gray-600 text-lg">
              Reminders can help you to stay on track in achieving your SMART
              goal. If you would like, the App can send you a daily or weekly
              reminder.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              Would you like to set a reminder?
            </h2>

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
              I would like to set a reminder
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
              I do not need to set a reminder
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
