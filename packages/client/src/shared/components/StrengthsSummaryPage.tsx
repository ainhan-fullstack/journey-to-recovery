import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const SummaryItem = ({ title, value }: { title: string; value: string }) => (
  <div className="space-y-1">
    <h2 className="text-3xl font-bold text-blue-800">{title}</h2>
    <p className="text-gray-700 text-lg">{value}</p>
  </div>
);

export default function StrengthsSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { strengths } = location.state || {};

  if (!strengths) {
    navigate("/strengths-form");
    return null;
  }

  const handleContinue = () => {
    navigate("/wellness-intro", {
      state: {
        strengths,
      },
    });
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-8 mt-8">
            <SummaryItem
              title="Things you are good at:"
              value={strengths.goodAt}
            />
            <SummaryItem
              title="Challenges you have overcome:"
              value={strengths.overcome}
            />
            <SummaryItem
              title="Friends/Family value these qualities:"
              value={strengths.valuedFor}
            />
            <SummaryItem title="You value:" value={strengths.values} />

            <p className="text-gray-600 text-lg pt-4">
              Reminding yourself of these strengths can help you to overcome
              obstacles on your journey to recovery.
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
