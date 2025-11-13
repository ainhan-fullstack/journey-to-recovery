import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/goal-setting");
  };

  return (
    <div className="flex justify-center bg-white min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-6 flex flex-col">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-blue-800 mt-4">
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

        <div className="my-8">
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
  );
}
