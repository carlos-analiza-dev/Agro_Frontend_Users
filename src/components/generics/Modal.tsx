import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";
export type ModalHeight = "auto" | "sm" | "md" | "lg" | "xl" | "full";

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: ModalSize;
  height?: ModalHeight;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  full: "sm:max-w-[95vw] md:max-w-[90vw]",
};

const heightClasses: Record<ModalHeight, string> = {
  auto: "max-h-[90vh]",
  sm: "max-h-[40vh]",
  md: "max-h-[60vh]",
  lg: "max-h-[75vh]",
  xl: "max-h-[85vh]",
  full: "max-h-[95vh]",
};

const Modal = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  size = "md",
  height = "auto",
  showCloseButton = true,
  className = "",
  contentClassName = "",
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn("p-0 gap-0", sizeClasses[size], className)}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <AlertDialogHeader className="p-0">
            <AlertDialogTitle className="text-xl font-semibold">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-sm text-gray-500 mt-1">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          {showCloseButton && (
            <AlertDialogCancel className="border-0 p-0 h-8 w-8 bg-transparent hover:bg-gray-100 rounded-full">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          )}
        </div>

        <div
          className={cn(
            "px-6 py-4 overflow-y-auto",
            heightClasses[height],
            contentClassName,
          )}
        >
          {children}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
