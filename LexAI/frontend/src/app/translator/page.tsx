"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { LanguageSelector } from "@/components/ui/language-selector-dropdown";
import { ArrowLeftRight, Copy, Volume2, History, X, Check, LogOut } from "lucide-react";
import Link from "next/link";

const LANGUAGES = {
  "auto": "Auto Detect",
  "en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil", 
  "fr": "French", "de": "German", "es": "Spanish", "ja": "Japanese",
  "zh-cn": "Chinese (Simplified)", "ar": "Arabic", "ru": "Russian", "ko": "Korean",
  "pt": "Portuguese", "it": "Italian", "nl": "Dutch", "pl": "Polish",
  "tr": "Turkish", "vi": "Vietnamese", "th": "Thai", "id": "Indonesian",
  "ml": "Malayalam", "kn": "Kannada", "mr": "Marathi", "gu": "Gujarati",
  "bn": "Bengali", "ur": "Urdu", "fa": "Persian", "he": "Hebrew",
  "el": "Greek", "sv": "Swedish", "da": "Danish", "fi": "Finnish",
  "no": "Norwegian", "cs": "Czech", "sk": "Slovak", "hu": "Hungarian",
  "ro": "Romanian", "bg": "Bulgarian", "uk": "Ukrainian", "sr": "Serbian",
  "hr": "Croatian", "sl": "Slovenian", "lt": "Lithuanian", "lv": "Latvian",
  "et": "Estonian", "ms": "Malay", "tl": "Tagalog", "sw": "Swahili",
  "am": "Amharic", "yo": "Yoruba", "zu": "Zulu", "af": "Afrikaans",
  "is": "Icelandic", "ga": "Irish", "cy": "Welsh", "mt": "Maltese",
  "sq": "Albanian", "mk": "Macedonian", "ka": "Georgian", "hy": "Armenian",
  "az": "Azerbaijani", "kk": "Kazakh", "uz": "Uzbek", "mn": "Mongolian",
  "km": "Khmer", "lo": "Lao", "my": "Burmese", "ne": "Nepali",
  "si": "Sinhala", "pa": "Punjabi"
};

export default function TranslatorPage() {
  const router = useRouter();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi"); // Default target
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'auto' ? 'en' : lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
  };

  const handleSwap = () => {
    if (sourceLang === "auto") {
      // If auto, can't easily swap target to auto. Default to EN.
      setSourceLang(targetLang);
      setTargetLang("en");
    } else {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
    }
    // Swap text as well
    setSourceText(translatedText);
    setTranslatedText("");
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/translations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          sourceText,
          sourceLang,
          targetLang
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Translation failed");
      }
      
      setTranslatedText(data.translatedText);
    } catch (error: any) {
      console.error(error);
      setTranslatedText("Error: " + error.message);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full pt-12">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FEF3E2] via-[#FAB12F] to-[#DD0303]">
          Translator Workspace
        </h1>
        <div className="space-x-2 md:space-x-4">
          <Link href="/dashboard">
            <Button className="glass bg-white/5">Dashboard</Button>
          </Link>
          <Link href="/history" className="hidden md:inline-block">
            <Button className="glass bg-white/5"><History className="h-4 w-4 mr-2"/> History</Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4"
      >
        {/* Source Language Card */}
        <GlowCard customSize={true} glowColor="blue" className="flex flex-col h-[400px] md:h-[500px]">
          <div className="border-b border-white/10 p-4 flex justify-between items-center bg-white/5">
            <LanguageSelector 
              value={sourceLang}
              onChange={setSourceLang}
              options={Object.entries(LANGUAGES).map(([code, label]) => ({ code, label }))}
            />
            <AnimatePresence>
              {sourceText.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClear}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="p-0 flex-1 relative flex flex-col">
            <textarea
              className="flex-1 w-full bg-transparent p-6 text-xl resize-none outline-none placeholder:text-white/30"
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              maxLength={5000}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-mono transition-colors ${sourceText.length >= 5000 ? 'text-red-400' : 'text-white/40'}`}>
              {sourceText.length} / 5000
            </div>
            {sourceText.length > 0 && (
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <Button 
                  className="h-9 w-9 p-0 rounded-full glass hover:bg-white/10 shadow-sm"
                  onClick={() => speakText(sourceText, sourceLang)}
                  title="Listen"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </GlowCard>

        {/* Swap Button */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              className="rounded-full h-12 w-12 glass hover:bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/20"
              onClick={handleSwap}
              title="Swap languages"
            >
              <ArrowLeftRight className="h-5 w-5 text-white/80" />
            </Button>
          </motion.div>
        </div>

        {/* Target Language Card */}
        <GlowCard customSize={true} glowColor="green" className="flex flex-col h-[400px] md:h-[500px]">
          <div className="border-b border-white/10 p-4 flex justify-between items-center bg-blue-500/10">
            <LanguageSelector 
              value={targetLang}
              onChange={setTargetLang}
              options={Object.entries(LANGUAGES).filter(([code]) => code !== 'auto').map(([code, label]) => ({ code, label }))}
            />
          </div>
          <div className="p-0 flex-1 relative flex flex-col">
            <div className={`flex-1 w-full p-6 text-xl text-white/90 overflow-y-auto ${isTranslating ? 'animate-pulse' : ''}`}>
              {translatedText || <span className="text-white/20">Translation will appear here...</span>}
            </div>
            
            <AnimatePresence>
              {translatedText && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 right-4 flex space-x-2"
                >
                  <Button 
                    className="h-10 px-4 rounded-xl glass hover:bg-white/10"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2 text-emerald-400" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button 
                    className="h-10 w-10 p-0 rounded-xl glass hover:bg-white/10"
                    onClick={() => speakText(translatedText, targetLang)}
                    title="Listen to translation"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlowCard>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex justify-center"
      >
        <Button 
          onClick={handleTranslate} 
          disabled={!sourceText || isTranslating}
          className="h-14 px-12 text-lg rounded-full bg-white text-black hover:bg-white/90 font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
        >
          {isTranslating ? (
            <span className="flex items-center">
              <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-3" />
              Translating...
            </span>
          ) : "Translate Now"}
        </Button>
      </motion.div>

      {/* Fixed Sign Out Button Bottom Left */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-6"
      >
        <Button 
          onClick={handleSignOut}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-transparent bg-transparent"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
