import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function WellnessWheelIntroPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { strengths } = location.state || {};

  if (!strengths) {
    navigate("/strengths-form");
    return null;
  }

  const handleContinue = () => {
    navigate("/wellness-instructions", {
      state: {
        strengths,
      },
    });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Now that you understand your strengths, next you'll complete the
              Wellness Wheel.
            </h1>
            <p className="text-gray-600 text-lg">
              The Wellness Wheel will help you to identify areas in your life
              that are going well, and ones that need more attention.
            </p>
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
