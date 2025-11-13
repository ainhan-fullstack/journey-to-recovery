import { Button } from "@/components/ui/button";
import { X, MapPin, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GettingStartedPage() {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate("/goal-prompt");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden">
        <div className="bg-teal-200 p-8 pt-12 relative flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-700 hover:bg-teal-300"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="flex items-center space-x-2">
            <MapPin className="h-12 w-12 text-gray-800" />
            <div className="w-24 border-t-2 border-dashed border-gray-800" />
            <Flag className="h-12 w-12 text-gray-800" />
          </div>
        </div>

        <div className="bg-white p-6 flex flex-col flex-grow">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-blue-800">
              Let's get started
            </h1>
            <p className="text-lg font-medium text-gray-500">Getting Started</p>
            <p className="text-gray-700 text-lg">
              In this activity you will create an achievable goal to work
              towards on your journey to recovery.
            </p>
            <p className="text-gray-700 text-lg">
              You can do this by working on an existing goal, or you can get
              support to create a new goal that is right for you.
            </p>
            <p className="text-gray-700 text-lg">Click 'Launch' to continue.</p>
          </div>

          <div className="flex-grow" />

          <div className="pt-6">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg cursor-pointer"
              onClick={handleLaunch}
            >
              Launch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
