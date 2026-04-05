import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  imageSrc,
  imageAlt = "Authentication",
}) => {
  return (
    <main
      className="min-h-screen w-full flex flex-col md:flex-row bg-cover bg-center items-center justify-center p-4 md:p-12"
      style={{ backgroundImage: `url('/assets/login_reg_bg.png')` }}
    >
      <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* Left Side: Image */}
        <div className="w-full md:w-[60%] relative h-[300px] md:h-[600px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full md:w-[35%] flex flex-col items-center justify-center p-8 md:p-10 bg-white rounded-md shadow-sm border border-gray-50 relative">
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/assets/logo.svg"
                alt="BuddyScript"
                width={160}
                height={35}
                className="h-auto w-auto"
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export { AuthLayout };
