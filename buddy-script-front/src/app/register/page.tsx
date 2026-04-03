import React from "react";
import AuthIllustration from "@/components/auth/AuthIllustration";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-screen overflow-hidden bg-bg-base py-[100px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Background shapes and primary illustration */}
          <AuthIllustration />

          {/* Registration Form logic and UI */}
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
