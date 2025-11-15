// src/pages/StrengthsIntroPage.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function StrengthsIntroPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/strengths-form");
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 mt-8">
            <h1 className="text-3xl font-bold text-blue-800">
              Understanding your strengths
            </h1>
            <p className="text-gray-600 text-lg">
              Everyone has their own strengths that they bring to recovery
              post-stroke. Understanding your strengths can help you to make
              progress and overcome obstacles as you work towards living your
              best life.
            </p>
            <p className="text-gray-600 text-lg">
              Let's explore your strengths.
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
