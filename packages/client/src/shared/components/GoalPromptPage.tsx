import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GoalPromptPage() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);

  const handleClose = () => {
    navigate("/");
  };

  const handleFinish = () => {
    if (selection === "yes") {
      navigate("/existing-goal");
    } else {
      navigate("/create-goal");
    }
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        
        <div className="relative p-6 flex flex-col flex-grow">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Do you already have a goal?
            </h1>
            <p className="text-gray-600 text-lg">
              Some people already know what they would like to achieve to live their best life post-stroke. Others are still exploring what this might look like.
            </p>
            <p className="text-gray-600 text-lg">
              There are different pathways in the J2R App depending on whether or not you would like some support to identify a goal to work towards.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              Do you already have a goal to work towards?
            </h2>

            <Button
              variant="outline"
              onClick={() => setSelection("yes")}
              className={cn(
                "w-full h-auto p-4 justify-start text-lg rounded-xl border-gray-300",
                "hover:bg-blue-50",
                selection === "yes" && "border-blue-600 border-2 bg-blue-50 text-blue-700"
              )}
            >
              Yes
            </Button>

            <Button
              variant="outline"
              onClick={() => setSelection("no")}
              className={cn(
                "w-full h-auto p-4 justify-start text-lg rounded-xl border-gray-300",
                "hover:bg-blue-50",
                selection === "no" && "border-blue-600 border-2 bg-blue-50 text-blue-700"
              )}
            >
              No
            </Button>
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleFinish}
              disabled={!selection}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}