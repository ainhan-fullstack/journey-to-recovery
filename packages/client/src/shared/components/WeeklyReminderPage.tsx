import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utilities/axiosConfig";
import axios from "axios";

export default function DailyReminderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allGoalData = location.state || {};

  if (!allGoalData.smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post("/goal", allGoalData);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to save goal.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Weekly Reminder
            </h1>
            <p className="text-gray-600 text-lg">
              Congratulations. You are now ready to start working on your SMART
              goal.
            </p>
            <p className="text-gray-600 text-lg">
              You will receive a reminder once a day at 9am.
            </p>
            <p className="text-gray-600 text-lg">
              You will be able to check-in with J2R to report on your progress,
              and when you are ready you can set a new SMART goal to keep
              progressing towards living your best life post-stroke.
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleFinish}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Finishing..." : "Finish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
