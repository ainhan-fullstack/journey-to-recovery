import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const SummaryItem = ({ title, value }: { title: string; value: string }) => (
  <div className="space-y-2">
    <h2 className="text-3xl font-bold text-blue-800">{title}</h2>
    <p className="text-gray-700 text-lg">{value}</p>
  </div>
);

export default function GoalSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    overallGoal,
    smartGoal,
    importance,
    motivation,
    confidence,
    confidenceReason,
  } = location.state || {};

  if (!smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    navigate("/set-reminder", {
      state: {
        overallGoal,
        smartGoal,
        importance,
        motivation,
        confidence,
        confidenceReason,
      },
    });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-8 mt-8">
            {overallGoal && (
              <SummaryItem title="Your Overall Goal Is:" value={overallGoal} />
            )}

            <SummaryItem title="Your SMART Goal Is:" value={smartGoal} />

            {motivation && (
              <SummaryItem
                title="Your SMART goal is important to you because:"
                value={motivation}
              />
            )}

            {confidenceReason && (
              <SummaryItem
                title="You are confident in achieving your SMART goal because:"
                value={confidenceReason}
              />
            )}
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
