import { Flag, TreePine } from "lucide-react";
import { GoalTracker } from "./GoalTracker";
import { InfoCard } from "./InfoCard";
import { UserHeader } from "./UserHeader";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4.2rem)]">
      <main className="flex-grow p-6 w-full max-w-md mx-auto space-y-6">
        <UserHeader name={user!.name!} progress={0} />

        <section className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {user!.name}!
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
