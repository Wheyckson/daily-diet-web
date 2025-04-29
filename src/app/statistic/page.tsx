import { Suspense } from "react";
import StatisticClient from "./StatisticClient";

export default function StatisticPage() {
  return (
    <Suspense fallback={<div>Carregando estatísticas...</div>}>
      <StatisticClient />
    </Suspense>
  );
}
