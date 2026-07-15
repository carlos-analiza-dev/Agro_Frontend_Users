import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  textColor: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  gradientFrom,
  gradientTo,
  iconColor,
  textColor,
}: StatCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} border transition-all duration-200 hover:shadow-md`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p
              className={`text-xs sm:text-sm font-medium truncate ${textColor}`}
            >
              {title}
            </p>
            <p
              className={`text-base sm:text-lg md:text-2xl font-bold truncate ${textColor}`}
            >
              {value}
            </p>
          </div>

          <div className="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
            <Icon className={`h-4 w-4 sm:h-5 sm:w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
