import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate, useLocation } from "react-router-dom";
import { Info } from "lucide-react";

export default function SmartGoalFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const overallGoal = location.state?.goal || "";

  const [smartGoal, setSmartGoal] = useState("");

  const handleContinue = () => {
    navigate("/smart-goal-confirm", {
      state: {
        overallGoal: overallGoal,
        smartGoal: smartGoal,
      },
    });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Set your SMART goal
            </h1>
            <p className="text-gray-600 text-lg">
              You can use this sentence as a template:{" "}
              <strong className="font-semibold">I will</strong> [what is the
              activity you will do?], [how often or for how long?], [in what
              timeframe?]
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              You'd like to achieve:
            </h2>
            <p className="text-gray-700 text-lg mt-1 italic">{overallGoal}</p>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-blue-800">
              What is your SMART goal?
            </h2>
            <Textarea
              placeholder="Enter text ..."
              className="min-h-[150px] text-lg rounded-xl"
              value={smartGoal}
              onChange={(e) => setSmartGoal(e.target.value)}
            />
          </div>

          <Accordion type="single" collapsible className="w-full mt-6">
            <AccordionItem value="item-1" className="border-b-2">
              <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>What is a SMART goal again?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-gray-600 text-base">
                <p>
                  A SMART goal is{" "}
                  <strong className="font-semibold">
                    Specific, Measurable, Achievable, Relevant, and Time-Bound
                  </strong>
                  .
                </p>
                <p>
                  For example, ‘I will go for a walk once around the block four
                  to five times each week for the next month’.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleContinue}
              disabled={!smartGoal}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
