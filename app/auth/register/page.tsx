"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";
import { userRegisterFormSchema } from "@/types/schema/userForm";
import Link from "next/link";

const steps = [
  { name: "Create Account", href: "#", status: 1 },
  { name: "Business Profile", href: "#", status: 2 },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type RegisterInputs = z.infer<typeof userRegisterFormSchema>;

export default function RegistrationForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof userRegisterFormSchema>>({
    resolver: zodResolver(userRegisterFormSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof userRegisterFormSchema>) {
    try {
      const res = await axios.post("/api/auth/register", values);
      if (res?.status === 200) {
        const { data } = res.data;

        console.log("====================================");
        console.log(data);
        console.log("====================================");
        await signInuser({
          username: values.email,
          password: values.password,
        });
        toast({
          variant: "default",
          title: "Registered successfully!",
        });
        router.push(`/dashboard`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${error?.response?.data}`,
      });
    }
  }

  const signInuser = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: username,
        password: password,
      });

      if (res?.error) {
        toast({
          variant: "destructive",
          title: "Wrong Username or Password",
          description: "Check your email or Password and try again",
        });

        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Occured!",
        description: `${error} Check your email or Password and try again`,
      });
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <>
      <div className="flex h-auto w-full justify-end lg:px-10">
        <Link href="/auth/login" className="flex items-center gap-2">
          Login
        </Link>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4  ">
        <div className="flex h-auto w-full max-w-xl flex-col items-center justify-center gap-4">
          <h2 className="text-center">Sign In to your account</h2>
          <h6 className="text-center">
            Enter your email and Password to login.
          </h6>
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-4 lg:gap-7 py-12 lg:mt-12"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex w-full">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/2">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" type="password" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex m-auto">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
