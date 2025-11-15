import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function WellnessWheelInstructionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { strengths } = location.state || {};

  if (!strengths) {
    navigate("/strengths-form");
    return null;
  }

  const handleContinue = () => {
    navigate("/wellness-wheel-form", {
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
              The Wellness Wheel
            </h1>
            <p className="text-gray-600 text-lg">
              The eight segments on the Wellness on the next page represent
              different areas of your life. Select the images one at a time and
              you will be provided with information about what each image
              represents in your life.
            </p>
            <p className="text-gray-600 text-lg">
              Rate your level of satisfaction with each area out of 10. 1 means
              you are struggling and feel unfulfilled in that area. 10 means
              you're satisfied with that area and don't think it needs much
              improvement. Go with your gut on this one.
            </p>
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
