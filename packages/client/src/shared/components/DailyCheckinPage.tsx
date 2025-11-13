import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const checkinOptions = [
  {
    id: "good",
    emoji: "🙂",
    text: "I'm making great progress and feeling good",
  },
  {
    id: "slow",
    emoji: "😐",
    text: "I'm progressing but slower than I would like",
  },
  { id: "stuck", emoji: "🙁", text: "I'm not making progress" },
  { id: "done", emoji: "✅", text: "I have completed my SMART goal" },
];

const DailyCheckinPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) {
      setError("Please select an option.");
      return;
    }
    setError(null);
    navigate("/check-in/confirm", { state: { status: selected } });
  };

  return (
    <div className="flex justify-center bg-white min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-blue-800 mt-4">
          Your Daily Check-In
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          How are you feeling about your progress on your SMART goal today?
        </p>

        <div className="space-y-4 mt-8">
          {checkinOptions.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              onClick={() => setSelected(option.id)}
              className={cn(
                "w-full h-auto p-4 flex items-center justify-start text-left rounded-xl border-gray-300",
                "hover:bg-blue-50",
                selected === option.id && "border-blue-600 border-2 bg-blue-50"
              )}
            >
              <span className="text-4xl mr-4">{option.emoji}</span>
              <span className="text-lg text-blue-800 font-medium whitespace-normal">
                {option.text}
              </span>
            </Button>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mt-4">{error}</p>
        )}

        <div className="mt-auto pt-6">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckinPage;
