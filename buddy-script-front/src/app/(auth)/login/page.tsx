import React from "react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - BuddyScript",
  description:
    "Log in to your BuddyScript account to manage your scripts and collaborate.",
};

const LoginPage = () => {
  return (
    <AuthLayout
      imageSrc="/assets/login.png"
      imageAlt="Login Illustration"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
