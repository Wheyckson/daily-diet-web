"use client";
import { Meal } from "@/type/meal";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  PencilSimpleLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MealEditSchema } from "@/schema/meal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup } from "@/components/ui/radio-group";
import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "@/components/spinner";
import { toast } from "sonner";

export default function MealDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("id");
  const [meal, setMeal] = useState<Meal>({
    date: "",
    description: "",
    hour: "",
    id: "",
    is_on_diet: false,
    name: "",
    user_id: "",
  });
  const [loadingMeal, setLoadingMeal] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [isOnDiet, setIsOnDiet] = useState("");

  const [loadingEditMeal, setLoadingEditMeal] = useState(false);

  const { pending } = useFormStatus();

  const form = useForm({
    resolver: zodResolver(MealEditSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      hour: "",
      is_in_diet: "1",
    },
  });

  const fetchMeal = async () => {
    if (!mealId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}`);
      const result = await response.json();

      setMeal(result);

      setName(result.name);
      setDescription(result.description);
      setDate(result.date);
      setHour(result.hour);
      setIsOnDiet(result.is_on_diet);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setLoadingMeal(false);
    }
  };

  useEffect(() => {
    fetchMeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlGoBack() {
    redirect("/home");
  }

  async function handleEditMeal() {
    const payload = {
      name: name,
      description: description,
      date: date,
      hour: hour,
      is_on_diet: isOnDiet === "1" ? true : false,
    };
    console.log("Dados para salvar:", payload);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast("Dado editado");
    } catch (error) {
      console.log("Erro ao editar dado:", error);
    } finally {
      setLoadingEditMeal(false);
      setOpenEditDialog(false);
      fetchMeal();
    }
  }

  async function handleDeleteMeal(mealId: string) {
    if (!mealId) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}`, {
        method: "DELETE",
      });

      toast("Refeição excluída");
    } catch (error) {
      console.log("Erro ao deletar dado:", error);
    } finally {
      setOpenDeleteDialog(false);
      router.push("/home");
    }
  }

  function bgHeaderColor(isOnDiet: boolean) {
    if (isOnDiet) {
      return "#CBE4B4";
    } else {
      return "#F3BABD";
    }
  }

  return (
    <div className="pt-10 w-screen">
      <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <div
            style={{ backgroundColor: bgHeaderColor(meal.is_on_diet) }}
            className="w-full flex mt-20 h-28 rounded-sm"
          >
            <div className="px-4 flex w-full items-center">
              <div className="flex justify-start">
                <ArrowLeft size={24} color="#333638" onClick={handlGoBack} />
              </div>
              <div className="flex w-full justify-center">
                <span className="text-lg font-bold text-[#333638]">
                  Refeição
                </span>
              </div>
            </div>
          </div>
        </div>

        {!loadingMeal ? (
          <div className="flex flex-col gap-y-6">
            {/* meal */}
            <div className="flex flex-col">
              <span className="font-bold text-xl">{meal.name}</span>
              <span className="text-base">{meal.description}</span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-xl">Data e hora</span>
              <span className="text-base">
                {meal.date} às {meal.hour}
              </span>
            </div>

            <div className="w-[144px] h-[34px] flex justify-center items-center gap-2 bg-[#fff7f7] shadow-md rounded-sm ">
              <span
                style={{
                  backgroundColor: meal.is_on_diet ? "#CBE4B4" : "#F3BABD",
                }}
                className="w-[14px] h-[14px] rounded-full"
              ></span>

              <span className="text-[#1B1D1E]">
                {meal.is_on_diet ? "dentro da dieta" : "fora da dieta"}
              </span>
            </div>

            <div className="flex flex-col justify-items-center mt-20 gap-4">
              {/* edit meal */}
              <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogTrigger asChild>
                  <Button className="flex hover:bg-[#2e3133] active:brightness-80 h-[50px] rounded-sm bg-[#333638]">
                    <div className="flex gap-2 items-center justify-center">
                      <PencilSimpleLine size={32} color="#FFFFFF" />
                      <span className="font-bold text-[#FFFFFF]">
                        Editar refeição
                      </span>
                    </div>
                  </Button>
                </DialogTrigger>

                {/* editMeal */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar refeição</DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleEditMeal)}
                      className="flex flex-col gap-5"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        {/* date */}
                        <div className="w-full flex">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="DD-MM-AAAA"
                                    maxLength={10}
                                    value={date}
                                    onChange={(e) => {
                                      let val = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      ); // remove não números

                                      if (val.length >= 3) {
                                        val = `${val.slice(0, 2)}-${val.slice(
                                          2
                                        )}`;
                                      }
                                      if (val.length >= 6) {
                                        val = `${val.slice(0, 5)}-${val.slice(
                                          5,
                                          9
                                        )}`;
                                      }

                                      setDate(val);
                                    }}
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* hour */}
                        <div className="w-full flex justify-center">
                          <FormField
                            control={form.control}
                            name="hour"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Hora</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="hh:mm"
                                    maxLength={5}
                                    value={hour}
                                    onChange={(e) => {
                                      let val = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      ); // remove não números

                                      if (val.length >= 3) {
                                        val = `${val.slice(0, 2)}:${val.slice(
                                          2,
                                          4
                                        )}`;
                                      }

                                      setHour(val);
                                    }}
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="is_in_diet"
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel>Está dentro da dieta?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(e) => setIsOnDiet(e)}
                                  value={isOnDiet}
                                  className="flex w-full gap-2"
                                >
                                  <FormItem className="w-full">
                                    <FormControl>
                                      <input
                                        type="radio"
                                        id="diet-sim"
                                        name="diet"
                                        className="peer hidden"
                                        value="1"
                                        onChange={(e) =>
                                          setIsOnDiet(e.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormLabel
                                      htmlFor="diet-sim"
                                      className="
                                          justify-center h-[50px] flex items-center
                                          cursor-pointer px-4 py-2 rounded-md border text-sm font-medium transition-all
                                        peer-checked:bg-[#E5F0DB] peer-checked:text-[#000000] peer-checked:border-green-600
                                        hover:bg-green-100"
                                    >
                                      <span
                                        style={{ backgroundColor: "#639339" }}
                                        className="flex items-center w-[14px] h-[14px] rounded-full"
                                      ></span>
                                      Sim
                                    </FormLabel>
                                  </FormItem>

                                  <FormItem className="w-full text-center">
                                    <FormControl>
                                      <input
                                        type="radio"
                                        id="diet-nao"
                                        name="diet"
                                        className="peer hidden"
                                        value="0"
                                        onChange={(e) =>
                                          setIsOnDiet(e.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormLabel
                                      htmlFor="diet-nao"
                                      className="
                                          justify-center h-[50px] flex items-center
                                          cursor-pointer px-4 py-2 rounded-md border text-sm font-medium transition-all
                                          peer-checked:bg-[#F4E6E7] peer-checked:text-[#000000] peer-checked:border-red-600
                                          hover:bg-red-100"
                                    >
                                      <span
                                        style={{
                                          backgroundColor: "#F3BABD",
                                        }}
                                        className="flex items-center w-[14px] h-[14px] rounded-full"
                                      ></span>
                                      Não
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter className="flex justify-center mt-6">
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>

                        <Button type="submit" disabled={pending}>
                          {loadingEditMeal ? "Carregando..." : "Salvar"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* delete meal */}
              <Dialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button className="flex hover:bg-[#fafafa] active:brightness-80 h-[50px] rounded-sm bg-[#FFFFFF] border-2 border-[#333638]">
                    <div className="flex gap-2 items-center justify-center">
                      <Trash size={32} color="#333638" />
                      <span className="font-bold text-[#333638]">
                        Excluir refeição
                      </span>
                    </div>
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Deseja realmente excluir o registro da refeição?
                    </DialogTitle>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="flex">
                        Cancelar
                      </Button>
                    </DialogClose>

                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      Confirmar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}
