import React from "react";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

interface Props {
  notificationsCount: number;
  onClick?: () => void;
}

export const NotificationButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ notificationsCount, onClick }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        className="relative h-8 w-8 rounded-full"
        onClick={onClick}
      >
        <Bell className="h-4 w-4" />

        {notificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {notificationsCount > 99 ? "99+" : notificationsCount}
          </span>
        )}
      </Button>
    );
  },
);

NotificationButton.displayName = "NotificationButton";
