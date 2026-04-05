"use client";

import React, { useState } from "react";
import ProfileForm from "@/components/settings/ProfileForm";
import PasswordForm from "@/components/settings/PasswordForm";
import { User, ShieldCheck } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile Info",
      icon: <User size={19} />,
    },
    {
      id: "security",
      label: "Security",
      icon: <ShieldCheck size={19} />,
    },
  ] as const;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Manage your profile, identity and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 p-1.5 bg-gray-50/80 rounded-md md:bg-transparent md:p-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-md transition-all duration-200 font-bold text-sm tracking-tight ${
                  activeTab === tab.id
                    ? "bg-white md:bg-[#0081ff]/8 text-[#0081ff] shadow-sm md:shadow-none ring-1 ring-black/5 md:ring-0"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
              >
                <span
                  className={
                    activeTab === tab.id
                      ? "text-[#0081ff]"
                      : "text-gray-400 group-hover:text-gray-600 transition-colors"
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-md p-6 sm:p-10 shadow-sm transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {activeTab === "profile"
                ? "Name & Avatar"
                : "Password & Security"}
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1.5 opacity-80">
              {activeTab === "profile"
                ? "Update your personal details and profile picture."
                : "Manage your authentication and password settings."}
            </p>
            <div className="h-px bg-gray-50 mt-8 w-full"></div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === "profile" ? <ProfileForm /> : <PasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
