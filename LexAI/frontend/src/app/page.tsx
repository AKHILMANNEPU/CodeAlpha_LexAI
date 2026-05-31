"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Zap, Lock } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DotGlobeHero } from "@/components/ui/globe-hero";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <DotGlobeHero 
      rotationSpeed={0.004}
      className="bg-background text-foreground"
    >
      <main className="flex flex-col items-center justify-center p-6 text-center w-full max-w-5xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full space-y-10"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            LexAI v2.0 is live
          </div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] select-none"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <span className="block font-light text-foreground/70 mb-3 text-4xl md:text-5xl lg:text-6xl tracking-tight">
                Break Language Barriers with
              </span>
              <span className="block relative pb-4">
                <span className="bg-gradient-to-r from-[#FEF3E2] via-[#FAB12F] to-[#DD0303] bg-clip-text text-transparent font-black relative z-10">
                  AI Precision
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FEF3E2] via-[#FAB12F] to-[#DD0303] bg-clip-text text-transparent font-black blur-2xl opacity-50 scale-105" 
                     style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  AI Precision
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 h-2 md:h-3 bg-gradient-to-r from-[#FAB12F] via-[#FA812F] to-transparent rounded-full shadow-lg shadow-[#DD0303]/50"
                />
              </span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto pt-4"
          >
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium" 
               style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Enterprise-grade translation platform powered by{" "}
              <span className="text-foreground font-semibold bg-gradient-to-r from-[#FAB12F]/20 to-[#DD0303]/10 px-2 py-1 rounded-md border border-white/5">
                advanced neural machine translation.
              </span>
            </p>
            <p className="text-lg text-muted-foreground/80 leading-relaxed mt-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Seamless, accurate, and insanely fast.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 font-semibold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300">
                Start Translating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button className="h-14 px-8 text-lg rounded-full glass border border-white/10 hover:bg-white/10 transition-colors">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md shadow-2xl">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">100+ Languages</h3>
              <p className="text-white/60 text-base leading-relaxed">Translate instantly between over a hundred languages with neural network accuracy.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md shadow-2xl">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Real-time Speed</h3>
              <p className="text-white/60 text-base leading-relaxed">Experience lightning-fast translations powered by Google Cloud infrastructure.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md shadow-2xl">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Enterprise Security</h3>
              <p className="text-white/60 text-base leading-relaxed">Your translations are secure. History is privately saved and fully encrypted.</p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </DotGlobeHero>
  );
}
