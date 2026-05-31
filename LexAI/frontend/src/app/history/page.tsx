"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Trash2, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("http://localhost:5000/api/translations", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/translations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setHistory(history.filter(h => h._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12 max-w-5xl mx-auto w-full">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard">
          <Button className="glass rounded-full h-10 w-10 p-0"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FEF3E2] via-[#FAB12F] to-[#DD0303]">
            Translation History
          </h1>
          <p className="text-white/60 text-sm">Review, search, and manage your past translations.</p>
        </div>
      </div>

      <div className="mb-8 flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <Input 
            className="pl-10 h-12 bg-white/5 border-white/10 rounded-full" 
            placeholder="Search translations..." 
          />
        </div>
        <Button className="h-12 glass rounded-full px-6">
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-white/50 h-8 w-8" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-12 text-white/50">
            No translations found. Start translating to see your history here.
          </div>
        ) : (
          history.map((item, i) => (
            <motion.div 
              key={item._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass border-white/5 hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <CardContent className="p-6 flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs font-medium text-white/50 mb-2">
                      <span className="uppercase bg-white/10 px-2 py-0.5 rounded">{item.sourceLang}</span>
                      <span>→</span>
                      <span className="uppercase bg-white/10 px-2 py-0.5 rounded">{item.targetLang}</span>
                      <span className="ml-4 opacity-50">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className="font-medium text-white/90">{item.sourceText}</p>
                      <p className="text-emerald-400">{item.translatedText}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full md:w-auto justify-end">
                    <Button className={`h-10 w-10 p-0 rounded-lg ${item.isFavorite ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-transparent' : 'glass'}`}>
                      <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      onClick={() => deleteItem(item._id)}
                      className="h-10 w-10 p-0 rounded-lg glass hover:bg-red-500/20 hover:text-red-400 hover:border-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
