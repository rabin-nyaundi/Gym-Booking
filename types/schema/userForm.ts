import { z } from "zod";

export const userLoginFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const userRegisterFormSchema = z
  .object({
    first_name: z.string().min(2, {
      message: "Name must be a valid email address.",
    }),
    last_name: z.string().min(2, {
      message: "Name must be a valid email address.",
    }),
    email: z.string().min(2, {
      message: "Email must be a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirm_password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password == data.confirm_password, {
    message: "passwords must match.",
    path: ["confirm_password"],
  });
