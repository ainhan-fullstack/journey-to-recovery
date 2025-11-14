import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

const ReminderButton = ({
  text,
  onClick,
  selected,
}: {
  text: string;
  onClick: () => void;
  selected: boolean;
}) => (
  <Button
    variant="outline"
    onClick={onClick}
    className={cn(
      "w-full h-auto p-4 flex items-center justify-start text-lg rounded-xl border-gray-300",
      "hover:bg-blue-50",
      selected && "border-blue-600 border-2 bg-blue-50 text-blue-700"
    )}
  >
    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
      <CalendarDays className="h-6 w-6 text-blue-600" />
    </div>
    {text}
  </Button>
);

export default function ReminderSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selection, setSelection] = useState<"daily" | "weekly" | null>(null);

  const allGoalData = location.state || {};

  if (!allGoalData.smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleFinish = () => {
    if (!selection) return;

    const nextState = {
      ...allGoalData,
      reminderType: selection,
    };

    if (selection === "daily") {
      navigate("/daily-reminder", { state: nextState });
    } else if (selection === "weekly") {
      navigate("/weekly-reminder", { state: nextState });
    }
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Setting Reminders
            </h1>
            <p className="text-gray-600 text-lg">
              Here you can set a schedule for the App to remind you to work
              towards your SMART goal.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <p className="text-gray-600 text-lg">
              If you would like to schedule a DAILY reminder, click here:
            </p>
            <ReminderButton
              text="Daily Reminder"
              onClick={() => setSelection("daily")}
              selected={selection === "daily"}
            />

            <p className="text-gray-600 text-lg">
              If you would like to schedule a WEEKLY reminder, click here:
            </p>
            <ReminderButton
              text="Weekly Reminder"
              onClick={() => setSelection("weekly")}
              selected={selection === "weekly"}
            />
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleFinish}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
