"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { userLoginFormSchema } from "@/types/schema/userForm";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userLoginFormSchema>>({
    resolver: zodResolver(userLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userLoginFormSchema>) {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        ...values,
      });

      console.log(res);

      if (res?.error) {
        toast({
          variant: "destructive",
          title: `${
            res.error == "CredentialsSignin"
              ? "Wrong Username or Password"
              : "res.error "
          }`,
          description: "Check your email or Password and try again",
        });
      } else {
        toast({
          variant: "default",
          title: `Success`,
          description: "User login successful",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Occured!",
        description: `${error} Check your email or Password and try again`,
      });
    }
  }

  return (
    <>
      <div className="flex h-auto w-full justify-end lg:px-10">
        <Button variant={"link"}>
          <Link href="/auth/register" className="flex items-center gap-2">
            Register
          </Link>
        </Button>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="flex h-full w-full max-w-xl flex-col items-center justify-center gap-4">
          <h2 className="text-center">Sign In to your account</h2>
          <h6 className="text-center">
            Enter your email and Password to login.
          </h6>
          <div className="flex h-auto w-full flex-col gap-10 py-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          type="email"
                          className="py-5"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Your Email Address.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          className="py-5"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Password must be at least 6 characters long.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting}
                  className="disabled:cursor-not-allowed disabled:bg-primary/50 bg-[#242424]"
                  type="submit"
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
