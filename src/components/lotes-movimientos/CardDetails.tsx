import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  total: number | string;
  Icon: LucideIcon;
  color: "blue" | "green" | "yellow" | "purple";
}

const CardDetails = ({ title, total, Icon, color }: Props) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <Icon className={`${"h-8 w-8 "} text-${color}-500`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDetails;
