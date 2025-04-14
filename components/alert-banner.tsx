import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-black dark:bg-yellow-100/80",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

type VariantType = keyof typeof iconMap;

interface AlertBannerProps {
  label: string;
  variant?: VariantType;
  className?: string;
}

const AlertBanner = ({ label, variant = "warning", className }: AlertBannerProps) => {
  const Icon = iconMap[variant];
  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};

export default AlertBanner;
