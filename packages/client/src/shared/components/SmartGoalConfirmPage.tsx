import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function SmartGoalConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { overallGoal, smartGoal } = location.state || {};

  if (!smartGoal) {
    navigate("/getting-started");
    return null;
  }

  const handleContinue = () => {
    navigate("/motivation-intro", { 
      state: { 
        overallGoal,
        smartGoal 
      } 
    });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Your SMART Goal Is:
            </h1>
            <p className="text-gray-700 text-lg mt-1">{smartGoal}</p>
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
