import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border border-blue-100",
  green: "bg-green-50 text-green-600 border border-green-100",
  purple: "bg-purple-50 text-purple-600 border border-purple-100",
  orange: "bg-orange-50 text-orange-600 border border-orange-100",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          {trend && (
            <p className="mt-2 text-sm flex items-center gap-1.5">
              <span
                className={`font-medium px-1.5 py-0.5 rounded text-xs ${
                  trend.isPositive 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-400">vs mês anterior</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
