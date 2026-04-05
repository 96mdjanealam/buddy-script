"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const registrationSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationValues = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegistrationValues) => {
    setError(null);
    try {
      await authService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      // Redirect or success state
      alert("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Get Started Now
        </p>
        <h1 className="text-[32px] font-bold text-[#1e293b]">Registration</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 rounded-md bg-red-50 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" error={errors.firstName?.message}>
            <Input
              {...register("firstName")}
              placeholder="First Name"
              type="text"
            />
          </FormField>
          <FormField label="Last Name" error={errors.lastName?.message}>
            <Input
              {...register("lastName")}
              placeholder="Last Name"
              type="text"
            />
          </FormField>
        </div>

        <FormField label="Email" error={errors.email?.message}>
          <Input
            {...register("email")}
            placeholder="Email Address"
            type="email"
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
          />
        </FormField>

        <FormField
          label="Repeat Password"
          error={errors.confirmPassword?.message}
        >
          <Input
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            type="password"
          />
        </FormField>

        <div className="pt-2">
          <Checkbox
            label="I agree to terms & conditions"
            error={errors.terms?.message}
            {...register("terms")}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-4 text-lg mt-4 shadow-sm"
          isLoading={isSubmitting}
        >
          Register now
        </Button>

        <div className="text-center pt-4">
          <p className="text-gray-500 text-[14px]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#0081ff] font-semibold hover:underline"
            >
              Login now
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export { RegistrationForm };
