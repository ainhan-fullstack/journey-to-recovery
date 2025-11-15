import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HeartPulse,
  Home,
  Coins,
  BarChart,
  HelpingHand,
  Bike,
  Brain,
  Users,
} from "lucide-react";

const segments = [
  {
    id: "social",
    title: "Social Wellbeing",
    Icon: Users,
    mainDescription: "Feeling connected to others",
    ratingDescription:
      "Rate your social wellbeing wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "physical",
    title: "Eating well, exercising, quality of sleep",
    Icon: HeartPulse,
    mainDescription:
      "Your physical health, nutrition, exercise, and sleep habits.",
    ratingDescription:
      "Rate your physical wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "environment",
    title: "Environmental Wellbeing",
    Icon: Home,
    mainDescription: "Having a safe and comfortable living and working space",
    ratingDescription:
      "Rate your environmental wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "financial",
    title: "Financial Wellbeing",
    Icon: Coins,
    mainDescription: "Budgeting, saving and managing money",
    ratingDescription:
      "Rate your financial wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "career",
    title: "Career",
    Icon: BarChart,
    mainDescription: "Experiencing satisfaction with work.",
    ratingDescription:
      "Rate your wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "spiritual",
    title: "Spiritual Wellbeing",
    Icon: HelpingHand,
    mainDescription: "Engaging in personal growth and understanding.",
    ratingDescription:
      "Rate your spiritual wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "recreation",
    title: "Recreation",
    Icon: Bike,
    mainDescription: "Engaging in hobbies, fun and downtime.",
    ratingDescription:
      "Rate your recreation wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
  {
    id: "mental",
    title: "Mental Wellbeing",
    Icon: Brain,
    mainDescription: "Having a healthy mindset and emotions.",
    ratingDescription:
      "Rate your mental wellbeing on a scale of 1-10. 1 means you are struggling and feel unfulfilled in that area. 10 means you're satisfied with that area and don't think it needs much improvement. If you'd like, you can also add text to explain your ranking.",
  },
];

export default function WellnessWheelFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(segments[0]);
  const [currentRating, setCurrentRating] = useState([5]);
  const [currentExplanation, setCurrentExplanation] = useState("");

  const { strengths } = location.state || {};
  if (!strengths) {
    navigate("/strengths-form");
    return null;
  }

  const handleSegmentClick = (segment: (typeof segments)[0]) => {
    setCurrentRating([ratings[segment.id] || 5]);
    setCurrentExplanation(explanations[segment.id] || "");
    setCurrentSegment(segment);
    setIsModalOpen(true);
  };

  const handleWheelClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    const outerRadius = rect.width / 2;
    const innerRadius = outerRadius * 0.3;

    if (distance < innerRadius) {
      return;
    }

    let angle = (Math.atan2(y, x) * (180 / Math.PI) + 90 + 360) % 360;

    const rotatedAngle = (angle + 22.5 + 360) % 360;

    const segmentIndex = Math.floor(rotatedAngle / 45);
    const segmentToOpen = segments[segmentIndex];

    if (segmentToOpen) {
      handleSegmentClick(segmentToOpen);
    }
  };

  const handleRatingSave = () => {
    setRatings({ ...ratings, [currentSegment.id]: currentRating[0] });
    setExplanations({
      ...explanations,
      [currentSegment.id]: currentExplanation,
    });
    setIsModalOpen(false);
  };

  const allSegmentsRated = Object.keys(ratings).length === segments.length;

  const handleComplete = () => {
    navigate("/wellness-summary", {
      state: {
        strengths,
        wellnessRatings: ratings,
        wellnessExplanations: explanations,
      },
    });
  };

  const conicBackground = {
    backgroundImage:
      "conic-gradient(from -22.5deg, #a855f7 0% 12.5%, #f97316 12.5% 25%, #eab308 25% 37.5%, #f87171 37.5% 50%, #a855f7 50% 62.5%, #f97316 62.5% 75%, #eab308 75% 87.5%, #f87171 87.5% 100%)",
  };

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold text-blue-800">
              Select each image on the wellness wheel to rank your level of
              satisfaction with each area.
            </h1>
            <p className="text-gray-600">
              You will need to select and and add your rating to each image
              before you can move on.
            </p>
          </div>

          <div
            className="relative w-80 h-80 mx-auto my-12 cursor-pointer"
            onClick={handleWheelClick}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={conicBackground}
            />

            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {segments.map((segment, index) => {
              const angle = index * 45;
              const transform = `rotate(${angle}deg) translateY(-7rem) rotate(-${angle}deg)`;

              return (
                <div
                  key={segment.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none"
                  style={{ transform }}
                >
                  <segment.Icon className="h-6 w-6 text-gray-800" />
                  {ratings[segment.id] && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-white flex items-center justify-center">
                      &#10003;
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-grow" />

          <div className="pt-6 mt-8">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleComplete}
              disabled={!allSegmentsRated}
            >
              Complete
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-center pt-8">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {currentSegment.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 px-6 space-y-4">
            <p className="text-lg font-bold text-gray-800">
              {currentSegment.mainDescription}
            </p>
            <p className="text-base text-gray-700">
              {currentSegment.ratingDescription}
            </p>

            <div className="w-full">
              <Slider
                value={currentRating}
                onValueChange={setCurrentRating}
                max={10}
                step={1}
                className="w-full mt-4"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 (Struggling)</span>
                <span>10 (Satisfied)</span>
              </div>
              <p className="text-center text-lg font-semibold text-blue-800 mt-2">
                Your Rating: {currentRating[0]}
              </p>
            </div>

            <Textarea
              placeholder="Enter text to explain your ranking..."
              value={currentExplanation}
              onChange={(e) => setCurrentExplanation(e.target.value)}
              className="min-h-[100px] text-lg rounded-xl mt-4"
            />
          </div>
          <DialogFooter className="px-6 pb-6">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
              onClick={handleRatingSave}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
