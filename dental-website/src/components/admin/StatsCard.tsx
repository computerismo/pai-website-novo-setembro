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

const colorConfig = {
  blue: {
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/25",
    bg: "bg-blue-500/10",
  },
  green: {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/25",
    bg: "bg-emerald-500/10",
  },
  purple: {
    gradient: "from-purple-500 to-pink-600",
    glow: "shadow-purple-500/25",
    bg: "bg-purple-500/10",
  },
  orange: {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/25",
    bg: "bg-orange-500/10",
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  const config = colorConfig[color];
  
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Subtle gradient background on hover */}
      <div className={`absolute inset-0 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 tracking-tight">{value}</p>
          {trend && (
            <p className="mt-3 text-sm flex items-center gap-2">
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                  trend.isPositive 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-slate-400">vs mês anterior</span>
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg ${config.glow}`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
