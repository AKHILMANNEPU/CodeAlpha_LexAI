"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setMessage("If an account exists, a reset link has been sent (check server console if no resend key).");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <Link href="/login" className="absolute top-8 left-8">
        <Button className="glass rounded-full px-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Login</Button>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Reset Password
            </CardTitle>
            <p className="text-white/60 text-sm">Enter your email and we'll send you a link</p>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">{error}</div>}
              {message && <div className="text-emerald-400 text-sm text-center bg-emerald-400/10 p-2 rounded">{message}</div>}
              
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
              
              <div className="pt-2">
                <Button type="submit" disabled={loading || !!message} className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-lg h-11 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
