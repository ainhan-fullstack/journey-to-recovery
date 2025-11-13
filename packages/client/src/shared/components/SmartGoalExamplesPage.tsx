import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate, useLocation } from "react-router-dom";
import { Info } from "lucide-react";

export default function SmartGoalExamplesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const goal = location.state?.goal;

  const handleContinue = () => {
    navigate("/smart-goal-intro", { state: { goal } });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden">
        <div className="bg-white p-6 flex flex-col flex-grow">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-800">
              Setting a SMART goal
            </h1>
            <p className="text-gray-600 text-lg">
              Let's have a look at some examples of SMART Goals.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full mt-6">
            <AccordionItem value="item-1" className="border-b-2">
              <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>SMART GOAL 1</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-gray-600 text-base">
                <p>A general goal might be: ‘I want to be more active’</p>
                <p>
                  Turned into a SMART goal this might become: ‘I will go for a
                  walk once around the block four to five times each week for
                  the next month’.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b-2">
              <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>SMART GOAL 2</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-gray-600 text-base">
                <p>
                  A general goal might be: ‘I will order and pay for a cup of
                  coffee at the coffee shop independently’.
                </p>
                <p>
                  Turned into a SMART goal this might become: ‘I will identify
                  which credit card is appropriate to use to buy coffee 4 out of
                  5 times by the end of October’.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
