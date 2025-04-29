"use client";
import Image from "next/image";
import logo from "@/assets/Logo.svg";
import avatar from "@/assets/avatar.png";
import { ArrowUpRight, Plus } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { LocalUserId } from "@/type/user";
import { ListMealGroupByDate, Meal } from "@/type/meal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMealSchema } from "@/schema/meal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "@/components/spinner";
import { EmptyListMessage } from "@/components/emptyListMessage";
import { toast } from "sonner";

const imageStyle = {
  borderRadius: "50%",
  border: "1px solid #000000",
};

export default function Home() {
  const { setTheme } = useTheme();

  const [userId, setUserId] = useState<LocalUserId | null>(null);

  const [percent, setPercent] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(true);
  const [bgPercent, setBgPercent] = useState("");
  const [bgIconPercent, setBgIconPercent] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mealList, setMealList] = useState([]);
  const [groupedMeals, setGroupedMeals] = useState<ListMealGroupByDate>([]);
  const [loadingMealList, setLoadingMealList] = useState(true);

  const { pending } = useFormStatus();
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingCreateMeal, setLoadingCreateMeal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [isOnDiet, setIsOnDiet] = useState("");

  const form = useForm({
    resolver: zodResolver(CreateMealSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      hour: "",
      is_in_diet: "",
    },
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    redirect("/");
  }

  //feature edit profile
  // function handleEditProfile() {
  //   console.log("");
  //   //redirect("/");
  // }

  function handleStatistics() {
    redirect(
      `/statistic?percent=${percent}&bgPercent=${encodeURIComponent(
        bgPercent
      )}&bgIconPercent=${encodeURIComponent(bgIconPercent)}`
    );
  }

  function handleViewMeal(mealId: string) {
    redirect(`/meal?id=${mealId}`);
  }

  function backgroundPercent() {
    if (Number(percent) >= 50) {
      return setBgPercent("#CBE4B4"), setBgIconPercent("#639339");
    } else {
      return setBgPercent("#F3BABD"), setBgIconPercent("#BF3B44");
    }
  }

  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      const obj = JSON.parse(usuario);
      setUserId(obj.user);
    }
  }, []);

  const fetchPercent = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meals/percent-diet/${userId.id}`
      );
      const result = await response.json();

      setPercent(result.porcent ? result.porcent : "0");
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setLoadingPercent(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPercent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (percent !== null) {
      backgroundPercent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  const fetchMealList = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meals/user/${userId.id}`
      );
      const data = await response.json();
      const meals = data.meals;
      setMealList(meals);

      // Agrupando por data a partir de meals
      const groupedByDate = Array.isArray(meals)
        ? meals.reduce((acc, item) => {
            if (!acc[item.date]) {
              acc[item.date] = [];
            }
            acc[item.date].push(item);
            return acc;
          }, {})
        : {};

      const groupedArray = Object.entries(groupedByDate).map(
        ([date, items]) => ({
          date,
          items: items as Meal[],
        })
      );

      setGroupedMeals(groupedArray);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setLoadingMealList(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMealList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleCreateMeal() {
    const payload = {
      name: name,
      description: description,
      date: date,
      hour: hour,
      isOnDiet: isOnDiet === "1" ? true : false,
    };
    console.log("Dados para salvar:", payload);

    if (!userId) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${userId.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast("Refeição criada");
    } catch (error) {
      console.log("Erro ao adicionar dados:", error);
    } finally {
      setLoadingCreateMeal(false);
      setOpenDialog(false);
      fetchMealList();
      fetchPercent();
    }
  }

  return (
    <div className="pt-10 w-screen">
      <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
        <div>
          {/* //header */}
          <div className="w-full flex justify-between">
            <Image src={logo} width={82} height={37} alt="Logo" />

            <div className="flex gap-3 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    Sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={avatar}
                    width={40}
                    height={40}
                    alt="Avatar"
                    style={imageStyle}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="flex justify-center">
                    Minha conta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {/* <DropdownMenuItem onClick={handleEditProfile}>
                      Editar perfil
                    </DropdownMenuItem> */}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* card */}
          <Button
            style={{ backgroundColor: bgPercent }}
            className="w-full flex hover:brightness-80 active:brightness-80 transition duration-200 mt-20 h-28 rounded-sm"
            onClick={handleStatistics}
          >
            <div className="p-4 flex-col w-full">
              <div className="flex justify-end">
                <ArrowUpRight size={24} color={`${bgIconPercent}`} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-[#333638]">
                  {`${loadingPercent ? "Carregando" : percent + "%"}`}
                </span>
                <span className="text-sm text-[#333638]">
                  das refeições dentro da dieta
                </span>
              </div>
            </div>
          </Button>

          {/* meal list */}
          <div className="mt-10 flex flex-col">
            <span className="text-base mb-2">Refeições</span>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="mb-6">
                  <div className="flex items-center gap-2">
                    <Plus size={32} />
                    <span className="">Nova refeição</span>
                  </div>
                </Button>
              </DialogTrigger>

              {/* Create Meal Dialog */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova refeição</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateMeal)}
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
                                  minLength={10}
                                  value={date}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, ""); // remove não números

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
                                    let val = e.target.value.replace(/\D/g, ""); // remove não números

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
                        {loadingCreateMeal ? "Carregando..." : "Salvar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            {!loadingMealList ? (
              groupedMeals.map((group) => (
                <Table key={group.date} className="mb-5">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-lg font-bold">
                        {group.date}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((meal) => (
                      <TableRow
                        className="mb-2 justify-center"
                        key={meal.id}
                        onClick={() => handleViewMeal(meal.id)}
                      >
                        <TableCell className="text-sm font-bold">
                          {meal.hour}
                        </TableCell>
                        <TableCell className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                          <p className="text-base truncate">{meal.name}</p>
                        </TableCell>

                        <TableCell className="flex justify-end h-10 items-center">
                          <span
                            style={{
                              backgroundColor: meal.is_on_diet
                                ? "#CBE4B4"
                                : "#F3BABD",
                            }}
                            className="w-[14px] h-[14px] rounded-full"
                          ></span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ))
            ) : (
              <LoadingSpinner />
            )}

            {!groupedMeals.length ? <EmptyListMessage /> : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
