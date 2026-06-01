"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Languages, LogOut, Settings, History, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalTranslations: 0, wordsTranslated: 0, apiUsage: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
        if (!token) {
          router.push("/login");
          return;
        }
        
        const [statsRes, historyRes] = await Promise.all([
          fetch(`https://codealpha-lexai.onrender.com/api/translations/stats`, { headers: { "Authorization": `Bearer ${token}` }}),
          fetch(`https://codealpha-lexai.onrender.com/api/translations`, { headers: { "Authorization": `Bearer ${token}` }})
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (historyRes.ok) {
          const data = await historyRes.json();
          setRecent(data.slice(0, 3)); // show top 3
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDashboardData();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-white/5 p-4 md:p-6 flex flex-col md:backdrop-blur-xl shrink-0">
        <div className="flex items-center justify-between mb-4 md:mb-12">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="LexAI Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain drop-shadow-md" />
            <span className="font-bold text-lg md:text-xl tracking-tight">LexAI</span>
          </div>
          <div className="flex md:hidden items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
            </div>
            <Button onClick={handleSignOut} size="sm" className="h-8 px-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <nav className="flex flex-row overflow-x-auto md:flex-col md:flex-1 gap-2 md:space-y-2 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden scroll-smooth">
          <Link href="/dashboard" className="shrink-0">
            <Button className="w-full justify-start bg-white/10 border-white/20 px-3 md:px-4">
              <Globe className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/translator" className="shrink-0">
            <Button className="w-full justify-start bg-transparent border-transparent hover:bg-white/5 px-3 md:px-4">
              <Languages className="mr-2 h-4 w-4" /> Translator
            </Button>
          </Link>
          <Link href="/history" className="shrink-0">
            <Button className="w-full justify-start bg-transparent border-transparent hover:bg-white/5 px-3 md:px-4">
              <History className="mr-2 h-4 w-4" /> History
            </Button>
          </Link>
          <Link href="/settings" className="shrink-0">
            <Button className="w-full justify-start bg-transparent border-transparent hover:bg-white/5 px-3 md:px-4">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </Link>
        </nav>

        <div className="hidden md:block pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'John Doe'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email || 'Pro Plan'}</p>
            </div>
          </div>
          <Button 
            onClick={handleSignOut}
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-transparent bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Overview</h1>
            <p className="text-white/60">Welcome back, here's what's happening.</p>
          </div>
          <Link href="/translator">
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Plus className="mr-2 h-4 w-4" /> New Translation
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-l-4 border-l-blue-400">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white/60 mb-2">Total Translations</p>
                <p className="text-4xl font-bold">{stats.totalTranslations}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-l-4 border-l-emerald-400">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white/60 mb-2">Words Translated</p>
                <p className="text-4xl font-bold">{stats.wordsTranslated > 1000 ? (stats.wordsTranslated / 1000).toFixed(1) + 'k' : stats.wordsTranslated}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-l-4 border-l-purple-400">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white/60 mb-2">API Usage</p>
                <p className="text-4xl font-bold">{stats.apiUsage}%</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <h2 className="text-xl font-bold mb-6">Recent Translations</h2>
        <div className="space-y-4">
          {recent.length === 0 ? (
            <p className="text-white/50">No recent translations found.</p>
          ) : recent.map((item, i) => (
            <motion.div 
              key={item._id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
            >
              <Card className="glass border-white/5 hover:border-white/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs font-medium text-white/50 mb-1">
                      <span className="uppercase">{item.sourceLang}</span>
                      <span>→</span>
                      <span className="uppercase">{item.targetLang}</span>
                    </div>
                    <p className="font-medium text-white/90">{item.sourceText}</p>
                    <p className="text-white/60 mt-1">{item.translatedText}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
