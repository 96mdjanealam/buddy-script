"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import { registerSchema, RegisterFormValues } from "@/schemas/auth.schema";
import Input from "@/components/ui/Input";

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agree: true,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await registerUser(data);
      router.push("/");
    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-white shadow-sm rounded-lg p-10 max-w-[450px] mx-auto">
        <div className="text-center mb-7">
          <Image
            src="/assets/images/logo.svg"
            alt="Buddy Script Logo"
            width={158}
            height={33}
            style={{ width: "158px", height: "auto" }}
            priority={true}
            className="mx-auto mb-7"
          />
          <p className="mb-2">Get Started Now</p>
          <h2 className="text-2xl font-semibold mb-10 text-color2">
            Registration
          </h2>
        </div>

        {serverError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <Input
              {...register("firstName")}
              label="First Name"
              placeholder="Enter First Name"
              error={errors.firstName?.message}
            />
            <Input
              {...register("lastName")}
              label="Last Name"
              placeholder="Enter Last Name"
              error={errors.lastName?.message}
            />
          </div>

          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="Enter Your Email"
            error={errors.email?.message}
          />

          <Input
            {...register("password")}
            label="Password"
            type="password"
            placeholder="Enter Your Password"
            error={errors.password?.message}
          />

          <Input
            {...register("confirmPassword")}
            label="Repeat Password"
            type="password"
            placeholder="Repeat Your Password"
            error={errors.confirmPassword?.message}
          />

          <div className="flex items-center space-x-2 mt-4">
            <input
              {...register("agree")}
              type="checkbox"
              id="agree"
              className="appearance-none w-4 h-4 rounded-full border border-gray-300 checked:border-primary transition-all cursor-pointer ring-offset-bg1 focus:ring-primary relative flex items-center justify-center after:content-[''] after:block after:w-2 after:h-2 after:rounded-full checked:after:bg-primary"
            />
            <label htmlFor="agree" className="text-sm cursor-pointer">
              I agree to terms & conditions
            </label>
          </div>
          {errors.agree && (
            <p className="text-red-500 text-xs mt-1">{errors.agree.message}</p>
          )}

          <div className="pt-6">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-md font-medium text-base hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Register Now"}
            </button>
          </div>
        </form>

        <div className="text-center mt-10">
          <p className="text-sm">
            Dont have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
