import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function SmartGoalPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const goal = location.state?.goal;

  const handleContinue = () => {
    navigate("/smart-goal-examples", { state: { goal } });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden">
        <div className="bg-white p-6 flex flex-col flex-grow">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-800">
              Setting a SMART Goal
            </h1>
            <p className="text-gray-600 text-lg">
              Now that you know what you'd like to achieve, let's turn this into
              a SMART goal.
            </p>
            <p className="text-gray-600 text-lg">
              SMART goals help you to break down your overall goal into
              short-term, achievable goals that you can work towards.
            </p>
            <p className="text-gray-600 text-lg">
              Watch this video about how to make your goal a SMART goal
            </p>
          </div>

          <div className="my-8">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/Iyl_v-O_Cds"
                title="Setting SMART Goals"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
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
