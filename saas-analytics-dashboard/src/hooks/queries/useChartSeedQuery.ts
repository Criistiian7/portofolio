import { useQuery } from "@tanstack/react-query";
import { mockChartSeed } from "@/services/mock/mockData";
import { queryKeys } from "@/lib/queryKeys";
import type { ChartSeed } from "@/types";

export function useChartSeedQuery() {
  return useQuery({
    queryKey: queryKeys.chartSeed(),
    queryFn: async (): Promise<ChartSeed> => mockChartSeed,
  });
}
