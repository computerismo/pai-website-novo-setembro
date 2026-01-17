
import StatsCard from "../StatsCard";
import { MousePointerClick, Eye, Percent, ArrowUpRight } from "lucide-react";
import { SeoStatsResponse } from "@/lib/types/seo";

interface SeoStatsCardsProps {
  data: SeoStatsResponse | null;
}

export function SeoStatsCards({ data }: SeoStatsCardsProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total de Cliques"
        value={data.clicks.toLocaleString()}
        icon={MousePointerClick}
        color="blue"
      />
      <StatsCard
        title="Impressões Totais"
        value={data.impressions.toLocaleString()}
        icon={Eye}
        color="purple"
      />
      <StatsCard
        title="CTR Médio"
        value={`${data.ctr}%`}
        icon={Percent}
        color="green"
      />
      <StatsCard
        title="Posição Média"
        value={data.position.toString()}
        icon={ArrowUpRight}
        color="orange"
      />
    </div>
  );
}
