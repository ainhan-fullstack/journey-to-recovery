import { Flag, TreePine } from "lucide-react";
import { GoalTracker } from "./GoalTracker";
import { InfoCard } from "./InfoCard";
import { UserHeader } from "./UserHeader";

export default function Dashboard() {
  const userName = "Johnathan";

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <main className="flex-grow p-6 w-full max-w-md mx-auto space-y-6">
        <UserHeader name={userName} progress={33} />

        <section className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {userName}!
          </h1>
          <p className="text-gray-600">What would you like to do today?</p>
        </section>

        <GoalTracker />

        <section className="space-y-4">
          <InfoCard
            preTitle="Find out about"
            title="Living your best life post-stroke"
            actionText="Start"
            Icon={TreePine}
          />
          <InfoCard
            preTitle="Find out about"
            title="Get started setting my recovery goal"
            actionText="Start"
            Icon={Flag}
          />
        </section>
      </main>
    </div>
  );
}
