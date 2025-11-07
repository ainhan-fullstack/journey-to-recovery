import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const DayTracker = ({ day, isChecked, dotColor }: { 
  day: string, 
  isChecked?: boolean, 
  dotColor?: string 
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="font-medium text-gray-500">{day}</span>
      {isChecked ? (
        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      ) : (
        <div className={`h-2 w-2 rounded-full ${dotColor || 'bg-gray-300'}`} />
      )}
    </div>
  );
};

export function GoalTracker() {
  return (
    <section className="space-y-5">
      <h2 className="font-semibold text-gray-700">Monitor the progress of your SMART goal</h2>
      
      {/* Week Tracker */}
      <div className="flex justify-between items-center px-2">
        <DayTracker day="S" dotColor="bg-gray-300" />
        <DayTracker day="M" dotColor="bg-blue-600" />
        <DayTracker day="T" dotColor="bg-blue-600" />
        <DayTracker day="W" isChecked={true} />
        <DayTracker day="T" dotColor="bg-gray-300" />
        <DayTracker day="F" dotColor="bg-gray-800" />
        <DayTracker day="S" dotColor="bg-gray-300" />
      </div>

      <Button 
        variant="outline"
        className="w-full h-12 bg-white text-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 text-base font-semibold"
      >
        Daily check-in
      </Button>
    </section>
  );
}