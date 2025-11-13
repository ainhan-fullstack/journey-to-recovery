import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utilities/axiosConfig";
import axios from "axios";
import { Brain, Target, Lightbulb } from "lucide-react";

const TopBanner = ({ title }: { title: string }) => (
  <div className="bg-teal-200 p-8 text-center">
    <p className="text-teal-800 text-sm font-medium border-b border-teal-800 inline-block pb-1">
      Check-In
    </p>
    <h1 className="text-3xl font-bold text-teal-900 mt-4">{title}</h1>
  </div>
);

const LinkButton = ({
  to,
  text,
  Icon,
}: {
  to: string;
  text: string;
  Icon: React.ElementType;
}) => (
  <Link
    to={to}
    className="flex items-center w-full p-4 space-x-4 bg-white rounded-lg border border-gray-300 hover:bg-gray-50"
  >
    <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-purple-100 flex items-center justify-center">
      <Icon className="h-8 w-8 text-purple-600" />
    </div>
    <span className="flex-grow text-left text-lg font-medium text-gray-800">
      {text}
    </span>
  </Link>
);

const messages = {
  good: {
    title: "You're making great progress",
    text: "Great work progressing with your SMART goal. Keep it up!",
  },
  slow: {
    title: "You're progressing but slower than you'd like",
    text: "It is normal to experience setbacks when working towards a goal. If you're happy to keep going and check in again tomorrow, click 'Finish'.",
  },
  stuck: {
    title: "You're not making progress",
    text: "If you need further support, it can help to remind yourself of your motivation...",
  },
  done: {
    title: "You have completed your SMART goal",
    text: "Congratulations on completing your SMART goal. What a great achievement.",
  },
};

export default function CheckinConfirmationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const status = location.state?.status as keyof typeof messages;

  if (!status) {
    navigate("/check-in");
    return null;
  }

  const { title, text } = messages[status] || { title: "Check-In", text: "" };

  // Handle the 'Finish' button click
  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post("/check-in", { status });
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPageContent = () => {
    switch (status) {
      case "stuck":
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">{text}</p>
            <LinkButton
              to="/motivation"
              text="Exploring my motivation"
              Icon={Brain}
            />
            <p className="text-gray-700 text-lg">
              Alternatively, you might want to adjust or create a new SMART
              goal...
            </p>
            <LinkButton
              to="/create-goal"
              text="Create a new SMART goal"
              Icon={Target}
            />
            <p className="text-gray-700 text-lg">
              If you've decided your overall goal is no longer relevant...
            </p>
            <LinkButton
              to="/create-new-goal"
              text="I'd like to set a new goal"
              Icon={Lightbulb}
            />
          </div>
        );

      case "slow":
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">{text}</p>
            <p className="text-gray-700 text-lg">
              If you need further support...
            </p>
            <LinkButton
              to="/motivation"
              text="Exploring my motivation"
              Icon={Brain}
            />
            <p className="text-gray-700 text-lg">
              Alternatively, you might want to adjust...
            </p>
            <LinkButton
              to="/create-goal"
              text="Create a new SMART goal"
              Icon={Target}
            />
          </div>
        );

      case "done":
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">{text}</p>
            <p className="text-gray-700 text-lg">
              Click below if you would like to create a new SMART goal...
            </p>
            <LinkButton
              to="/create-goal"
              text="Create a new SMART goal"
              Icon={Target}
            />
            <p className="text-gray-700 text-lg">
              Alternatively, click below if you'd like support...
            </p>
            <LinkButton
              to="/create-new-goal"
              text="I'd like to set a new goal"
              Icon={Lightbulb}
            />
          </div>
        );

      case "good":
      default:
        return <p className="text-gray-700 text-lg text-center">{text}</p>;
    }
  };

  return (
    <div className="flex flex-col items-center bg-orange-50 min-h-[calc(100vh-4rem)]">
      <TopBanner title={title} />

      <div className="w-full max-w-md p-6 flex flex-col flex-grow">
        {renderPageContent()}

        <div className="flex-grow" />

        <div className="pt-6">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
            onClick={handleFinish}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Finishing..." : "Finish"}
          </Button>
          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
