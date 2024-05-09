"use client";

import { NextPage } from "next";

import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import dynamic from "next/dynamic";

const DashboardPage: NextPage = () => {
  const { isIn } = useAtomValue(projectApplicationPeriodAtom);
  const RegistrationDashboard = dynamic(() => import("./RegistrationDashboard"));
  const NormalDashboard = dynamic(() => import("./NormalDashboard"));
  if (isIn) return <RegistrationDashboard />;
  return <NormalDashboard />;
};

export default DashboardPage;
