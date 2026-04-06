"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get("email");
      if (emailParam) {
        setValue("email", emailParam, { shouldValidate: true });
      }
    }
  }, [setValue]);

  const autofillCredentials = () => {
    setValue("email", "user12@gmail.com", { shouldValidate: true });
    setValue("password", "123456", { shouldValidate: true });
  };

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    try {
      await login(values);
      router.push("/"); // Or dashboard path
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Welcome Back
        </p>
        <h1 className="text-[32px] font-bold text-[#1e293b]">Login Now</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <FormField label="Email" error={errors.email?.message}>
          <Input
            {...register("email")}
            placeholder="Email Address"
            type="email"
            className="h-12"
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              {...register("password")}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="h-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={autofillCredentials}
            className="text-sm font-medium text-[#0081ff] hover:underline"
          >
            Auto fill credentials!
          </button>
        </div>

        <Button
          type="submit"
          className="w-full py-4 text-lg mt-4 shadow-sm"
          isLoading={isSubmitting}
        >
          Login
        </Button>

        <div className="text-center pt-6">
          <p className="text-gray-500 text-[14px]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#0081ff] font-semibold hover:underline"
            >
              Register now
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export { LoginForm };


