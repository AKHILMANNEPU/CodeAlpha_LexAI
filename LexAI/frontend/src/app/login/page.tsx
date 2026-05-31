"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <Link href="/" className="absolute top-8 left-8">
        <Button className="glass rounded-full px-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back Home</Button>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Welcome Back
            </CardTitle>
            <p className="text-white/60 text-sm">Sign in to your LexAI account</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">{error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email</label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-white/80">Password</label>
                  <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline cursor-pointer">
                    Forgot?
                  </Link>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-lg h-11 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
            <div className="text-center text-sm text-white/60">
              Don't have an account?{" "}
              <Link href="/register" className="text-emerald-400 hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
