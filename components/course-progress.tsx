// components/course-progress.tsx
import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { CheckCircle, Clock, Trophy } from "lucide-react";

const colorByVariant = {
  default: "text-blue-700",
  success: "text-emerald-700",
  warning: "text-amber-700"
};

const bgColorByVariant = {
  default: "bg-blue-50",
  success: "bg-emerald-50", 
  warning: "bg-amber-50"
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
  lg: "text-base"
};

const iconSizeByVariant = {
  default: "w-4 h-4",
  sm: "w-3 h-3",
  lg: "w-5 h-5"
};

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success" | "warning";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export const CourseProgress = ({ 
  value, 
  variant, 
  size = "default",
  showIcon = true,
  showPercentage = true,
  label,
  className
}: CourseProgressProps) => {
  
  // Determinar variante automáticamente basada en el valor si no se especifica
  const computedVariant = variant || (value === 100 ? "success" : value >= 75 ? "warning" : "default");
  
  // Asegurar que el valor esté entre 0 y 100
  const normalizedValue = Math.max(0, Math.min(100, value || 0));
  
  // Seleccionar icono basado en el progreso
  const getIcon = () => {
    if (normalizedValue === 100) {
      return <Trophy className={iconSizeByVariant[size]} />;
    } else if (normalizedValue >= 75) {
      return <CheckCircle className={iconSizeByVariant[size]} />;
    } else {
      return <Clock className={iconSizeByVariant[size]} />;
    }
  };

  // Determinar el texto del estado
  const getStatusText = () => {
    if (normalizedValue === 100) return "Completado";
    if (normalizedValue >= 75) return "Casi terminado";
    if (normalizedValue >= 25) return "En progreso";
    if (normalizedValue > 0) return "Iniciado";
    return "No iniciado";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Barra de progreso */}
      <Progress
        value={normalizedValue}
        variant={computedVariant}
        className={cn(
          "h-2 transition-all duration-300",
          size === "sm" && "h-1.5",
          size === "lg" && "h-3"
        )}
      />
      
      {/* Información del progreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcon && (
            <span className={cn(
              colorByVariant[computedVariant],
              "flex items-center"
            )}>
              {getIcon()}
            </span>
          )}
          
          <span className={cn(
            "font-medium",
            colorByVariant[computedVariant],
            sizeByVariant[size]
          )}>
            {label || getStatusText()}
          </span>
        </div>
        
        {showPercentage && (
          <span className={cn(
            "font-semibold tabular-nums",
            colorByVariant[computedVariant],
            sizeByVariant[size]
          )}>
            {Math.round(normalizedValue)}%
          </span>
        )}
      </div>
      
      {/* Badge de estado para tamaño grande */}
      {size === "lg" && (
        <div className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
          bgColorByVariant[computedVariant],
          colorByVariant[computedVariant],
          "border-current border-opacity-20"
        )}>
          {getStatusText()}
        </div>
      )}
    </div>
  );
};