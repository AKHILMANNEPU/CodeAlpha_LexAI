"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Validation State
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[0-9]/, text: "At least 1 number" },
  ];

  const isValidPassword = requirements.every((req) => req.regex.test(password));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword) {
      setError("Please ensure your password meets all requirements.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
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
              Create Account
            </CardTitle>
            <p className="text-white/60 text-sm">Join LexAI today</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Full Name</label>
                <Input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                <label className="text-sm font-medium text-white/80">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {/* Password Requirements UI */}
                {password && (
                  <div className="mt-2 space-y-1 bg-white/5 p-3 rounded-md text-xs">
                    {requirements.map((req, idx) => {
                      const met = req.regex.test(password);
                      return (
                        <div key={idx} className={`flex items-center space-x-2 ${met ? 'text-emerald-400' : 'text-white/50'}`}>
                          {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{req.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button type="submit" disabled={loading || (password.length > 0 && !isValidPassword)} className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-lg h-11 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50">
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
            </form>
            
            <div className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
