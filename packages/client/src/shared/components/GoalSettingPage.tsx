import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function GoalSettingPage() {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center bg-white min-h-[calc(100vh-4rem)]">
      
      <div className="w-full max-w-md p-6 flex flex-col">
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-blue-800 mt-4">
            Goal Setting for Stroke Recovery
          </h1>
          <p className="text-gray-600 text-lg">
            Setting goals is important in stroke recovery. A goal is simply something that you would like to be able to do that would help you to live your best life. Goals can be large or small - what's important to you won't be the same as what's important to someone else.
          </p>
          <p className="text-gray-600 text-lg">
            Goal setting is more than a wish list or New Year's Resolution. It involves deciding what you want, figuring out how to get there, and taking small steps to make it happen.
          </p>
          <p className="text-gray-600 text-lg">
            Watch this video to find out more about the value of goal setting for stroke recovery.
          </p>
        </div>

        <div className="my-8">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/3rnVPtyS1fE"
              title="Tony Finneran on Goal Setting"
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
            onClick={handleFinish}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}