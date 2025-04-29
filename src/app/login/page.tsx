"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/schema/user";
import logo from "@/assets/Logo.svg";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { pending } = useFormStatus();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    //se ja estiver logado, redireciona
    const user = localStorage.getItem("user");
    if (user) {
      redirect("/home");
    }
  }, []);

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    console.log(data);
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.API_URL}/users/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        setLoading(false);
        localStorage.setItem("user", JSON.stringify({ user: res.data.user }));
      }
    } catch (e) {
      console.log(e);

      setLoading(false);
      alert("Login Falhou");
    } finally {
      redirect("/home");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md shadow-md">
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="Logo"
            width={82}
            height={37}
            className="bg-[#FFF]"
          />
        </div>
        <CardHeader className="w-full flex flex-col gap-y-2 items-center justify-center">
          <CardTitle className="inline text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Faça seu login para acessar seu Daily App.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={pending}>
                {loading ? "Carregando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="font-normal w-full" size="sm">
            <Link href={"/register"}>Criar uma conta</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
