import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/goal-setting");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden">
        <div className="bg-teal-200 p-8 pt-12 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-700 hover:bg-teal-300"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <Progress value={50} className="w-full" />
        </div>

        <div className="bg-white p-6 flex flex-col flex-grow">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-800">
              Welcome to Journey to Recovery!
            </h1>
            <p className="text-gray-600 text-lg">
              Navigating life after a stroke can be challenging, but with the
              right support, it can also be a time of growth and renewal.{" "}
              <span className="font-semibold">Journey to Recovery</span> is here
              to empower you on this path by helping you set and track your
              personal goals.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/BFXgpsn-Mms"
              title="RehabChat Showcase Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex-grow" />

          <div className="pt-6">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg cursor-pointer"
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
