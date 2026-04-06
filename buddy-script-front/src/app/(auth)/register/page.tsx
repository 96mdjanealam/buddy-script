import React from "react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegistrationForm } from "@/components/auth/registration-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - BuddyScript",
  description:
    "Create your BuddyScript account and start building your future.",
};

const RegisterPage = () => {
  return (
    <AuthLayout
      imageSrc="/assets/registration_3.png"
      imageAlt="Registration Illustration"
    >
      <RegistrationForm />
    </AuthLayout>
  );
};

export default RegisterPage;


