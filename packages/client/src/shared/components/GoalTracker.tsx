import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../utilities/axiosConfig";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function GoalTracker() {
  const { isAuthenticated } = useAuth();
  const [weekStatus, setWeekStatus] = useState<boolean[]>(
    new Array(7).fill(false)
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWeekStatus = useCallback(async () => {
    try {
      const response = await api.get("/check-ins");
      setWeekStatus(response.data.weekStatus);
    } catch (error) {
      console.error("Failed to fetch week status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeekStatus();
    }
  }, [isAuthenticated, fetchWeekStatus]);

  const todayIndex = new Date().getDay();
  const isTodayChecked = weekStatus[todayIndex];

  return (
    <section className="space-y-5">
      <h2 className="font-semibold text-gray-700">
        Monitor the progress of your SMART goal
      </h2>

      <div className="w-full pt-2">
        <div className="relative flex justify-between items-center px-1">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-blue-500 -translate-y-1/2" />

          {weekStatus.map((isChecked, index) => {
            const isFuture = index > todayIndex;

            let nodeSize, nodeColor, icon;

            if (isChecked) {
              // Rule 1: "Big tick like the image"
              nodeSize = "h-8 w-8"; // 32px
              nodeColor = "bg-blue-500"; // Light blue circle
              icon = <Check className="h-6 w-6 text-blue-900" />; // Dark blue tick
            } else {
              // Not checked in
              nodeSize = "h-4 w-4"; // 16px (a "dot")
              icon = null;

              if (isFuture) {
                // Rule 3: "Future" -> Grey dot
                nodeColor = "bg-gray-400";
              } else {
                // Rule 2: "Passed away" (or today) -> Blue dot
                nodeColor = "bg-blue-500";
              }
            }

            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-full flex items-center justify-center transition-all",
                  nodeSize,
                  nodeColor
                )}
              >
                {icon}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-3">
          {DAY_LABELS.map((day, index) => (
            <span
              key={index}
              className="w-8 text-center font-semibold text-blue-900"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-12 bg-white text-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 text-base font-semibold cursor-pointer"
        onClick={() => navigate("/check-in")}
        disabled={isTodayChecked || isLoading}
      >
        {isTodayChecked
          ? "Checked in!"
          : isLoading
          ? "Loading..."
          : "Daily check-in"}
      </Button>
    </section>
  );
}
