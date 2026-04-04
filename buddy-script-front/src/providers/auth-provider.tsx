"use client";

import React, { useEffect } from "react";
import { AuthProvider as ContextProvider, useAuth } from "@/context/auth-context";

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ContextProvider>
      <AuthCheck>{children}</AuthCheck>
    </ContextProvider>
  );
};
