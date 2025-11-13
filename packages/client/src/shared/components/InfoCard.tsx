// src/components/InfoCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  preTitle: string;
  title: string;
  actionText?: string;
  Icon?: LucideIcon;
  onClick: () => void;
}

export function InfoCard({ preTitle, title, actionText, Icon, onClick }: InfoCardProps) {
  return (
    <Card className="bg-blue-600 text-white rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 max-w-[70%]">
            <p className="text-sm">{preTitle}</p>
            <h3 className="text-2xl font-bold leading-tight">{title}</h3>
            {actionText && (
              <Button onClick={onClick} variant="link" className="text-white p-0 text-lg font-semibold hover:no-underline cursor-pointer">
                {actionText}
              </Button>
            )}
          </div>
          {Icon && (
            <Icon className="h-16 w-16 text-white opacity-50 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}