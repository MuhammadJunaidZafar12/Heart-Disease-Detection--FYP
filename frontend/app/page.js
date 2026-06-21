'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "./login/page";
import Register from "./register/page";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnalysisCharts from "@/components/AnalysisCharts";
import WhyChooseCardiogaurd from "@/components/WhyChooseCardiogaurd";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <HeroSection />
      <WhyChooseCardiogaurd />
      <HowItWorks />
      <AnalysisCharts />
      
    </>
  );
}