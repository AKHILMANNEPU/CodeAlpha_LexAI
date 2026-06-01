import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface LanguageOption {
  code: string;
  label: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  options: LanguageOption[];
  className?: string;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, options, className, disabled }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.code === value) || options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block z-[100]", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center justify-between gap-2 rounded-full border px-4 py-2 text-sm min-w-[150px]",
          "bg-white/10 backdrop-blur-md shadow-sm",
          "border-white/20",
          "text-white",
          "hover:bg-white/20 transition-all",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="truncate font-medium">{selectedOption?.label}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-70 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={cn(
            "absolute left-0 mt-2 w-56 max-h-64 overflow-y-auto rounded-xl",
            "bg-black/90 backdrop-blur-xl",
            "shadow-2xl border border-white/10",
            "animate-fade-in z-[100] custom-scrollbar"
          )}
        >
          {options.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-4 py-3 text-sm text-left transition-colors",
                value === lang.code
                  ? "font-bold bg-white/10 text-blue-400"
                  : "text-neutral-200 hover:bg-white/10"
              )}
            >
              <span className="flex-1 truncate">{lang.label}</span>
              {value === lang.code && (
                <Check className="h-4 w-4 text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
