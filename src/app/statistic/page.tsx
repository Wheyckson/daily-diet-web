"use client";
import { LocalUserId, RequestStatisticUser } from "@/type/user";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatisticUser() {
  const searchParams = useSearchParams();
  const percent = searchParams.get("percent");
  const bgPercent = searchParams.get("bgPercent");
  const bgIconPercent = searchParams.get("bgIconPercent");

  const [userId, setUserId] = useState<LocalUserId | null>(null);

  const [statisticUser, setStatisticUser] = useState<RequestStatisticUser>({
    bestOnDietSequence: 0,
    totalMeals: 0,
    totalMealsOnDiet: 0,
    totalMealsOffDiet: 0,
  });

  const [loadingStatisticUser, setLoadingStatisticUser] = useState(true);

  function handlGoBack() {
    redirect("/home");
  }

  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      const obj = JSON.parse(usuario);
      setUserId(obj.user);
    }
  }, []);

  useEffect(() => {
    const fetchStatisticUser = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `${process.env.API_URL}/meals/metrics/${userId.id}`
        );
        const result = await response.json();

        setStatisticUser(result);
      } catch (error) {
        console.log("Erro ao buscar dados:", error);
      } finally {
        setLoadingStatisticUser(false);
      }
    };

    fetchStatisticUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId?.id]);

  return (
    <div className="pt-10 w-screen">
      <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
        <div>
          {/* card */}
          <div
            style={{ backgroundColor: bgPercent! }}
            className="w-full flex mt-20 h-28 rounded-sm"
          >
            <div className="p-4 flex-col w-full">
              <div className="flex justify-start">
                <ArrowLeft
                  size={24}
                  color={`${bgIconPercent}`}
                  onClick={handlGoBack}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-[#333638]">
                  {percent + "%"}
                </span>
                <span className="text-sm text-[#333638]">
                  das refeições dentro da dieta
                </span>
              </div>
            </div>
          </div>

          {/* statistics */}
          <div className="mt-8 flex flex-col">
            {/* title */}
            <div className="w-full flex justify-center">
              <span className="text-base font-bold">Estatísticas gerais</span>
            </div>

            {/* cards info */}
            {!loadingStatisticUser ? (
              <div className="mt-6 flex flex-col gap-y-4">
                <div className="flex flex-col justify-center items-center bg-[#f8f8f8] h-[107px] shadow-md  rounded-sm">
                  <span className="text-2xl font-bold text-[#1B1D1E]">
                    {statisticUser.bestOnDietSequence}
                  </span>
                  <span className="text-sm text-[#333638]">
                    melhor sequência de pratos dentro da dieta
                  </span>
                </div>

                <div className="flex flex-col justify-center items-center bg-[#f8f8f8] h-[107px] shadow-md rounded-sm">
                  <span className="text-2xl font-bold text-[#1B1D1E]">
                    {statisticUser.totalMeals}
                  </span>
                  <span className="text-sm text-[#333638]">
                    refeições registradas
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col justify-center items-center bg-[#CBE4B4] w-full h-[107px] shadow-lg rounded-sm px-4">
                    <span className="text-2xl font-bold text-[#1B1D1E]">
                      {statisticUser.totalMealsOnDiet}
                    </span>
                    <span className="text-sm text-[#333638]">
                      refeições dentro da dieta
                    </span>
                  </div>

                  <div className="flex flex-col justify-center items-center bg-[#F3BABD] w-full h-[107px] shadow-lg rounded-sm px-4">
                    <span className="text-2xl font-bold text-[#1B1D1E]">
                      {statisticUser.totalMealsOffDiet}
                    </span>
                    <span className="text-sm text-[#333638]">
                      refeições fora da dieta
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <span>Carregando</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
