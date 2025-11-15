import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utilities/axiosConfig";
import axios from "axios";

const ratingTitles: Record<string, string> = {
  physical: "physical wellbeing",
  mental: "mental wellbeing",
  social: "social wellbeing",
  recreation: "recreational wellbeing",
  financial: "financial wellbeing",
  work: "satisfaction with work as",
  spiritual: "spiritual wellbeing",
  environment: "environmental wellbeing",
};
const displayOrder = [
  "physical",
  "mental",
  "social",
  "recreation",
  "financial",
  "work",
  "spiritual",
  "environment",
];

const RatingItem = ({ title, value }: { title: string; value: number }) => (
  <div className="space-y-1">
    <h2 className="text-3xl font-bold text-blue-800">
      Your rated you {title} as:
    </h2>
    <p className="text-gray-700 text-lg">{value}</p>
  </div>
);

export default function WellnessWheelSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [focusArea, setFocusArea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { strengths, wellnessRatings, wellnessExplanations } =
    location.state || {};

  if (!wellnessRatings) {
    navigate("/wellness-wheel-form");
    return null;
  }

  const handleContinue = async () => {
    setIsSubmitting(true);
    setError(null);

    const summaryData = {
      wellnessRatings,
      wellnessExplanations,
      focusArea,
      strengths,
    };

    try {
      await api.post("/wellness-summary", summaryData);

      navigate("/new-goal-intro", {
        state: {
          strengths,
          wellnessRatings,
          wellnessExplanations,
          focusArea,
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to save summary.");
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
          <h1 className="text-3xl font-bold text-blue-800 mt-8">
            Wellness Wheel Responses
          </h1>

          <div className="space-y-8 mt-8">
            {displayOrder.map((key) => {
              const value = wellnessRatings[key];
              const title = ratingTitles[key];
              return value !== undefined ? (
                <RatingItem key={key} title={title} value={value} />
              ) : null;
            })}
          </div>

          <div className="space-y-4 mt-12">
            <h2 className="text-3xl font-bold text-blue-800">
              Looking at your responses, what area of your life would you like
              to focus on?
            </h2>
            <Textarea
              placeholder="Enter text ..."
              className="min-h-[150px] text-lg rounded-xl"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
              disabled={!focusArea || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
