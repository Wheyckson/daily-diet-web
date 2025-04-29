import { Suspense } from "react";
import MealDetailClient from "./MealDetailClient";

export default function MealPage() {
  <Suspense fallback={<div>Carregando...</div>}>
    <MealDetailClient />
  </Suspense>;
}
