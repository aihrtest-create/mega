import React from "react";
import { ChevronLeft } from "lucide-react";
import { v3 } from "../theme";

interface Props {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  // Optional translucent / scrolled variant
  transparent?: boolean;
}

export function TopBar({ onBack, title, subtitle, rightSlot, transparent }: Props) {
  return (
    <div
      className="sticky top-0 z-40"
      style={{
        background: transparent ? "transparent" : "rgba(255,255,255,0.85)",
        backdropFilter: transparent ? "none" : "blur(20px) saturate(180%)",
      }}
    >
      <div className="max-w-lg mx-auto flex items-center gap-3 px-4 pt-3 pb-3 min-h-14">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] active:scale-95 transition-transform shrink-0"
            aria-label="Назад"
            style={{ color: v3.purpleDeep }}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="text-[15px] font-bold truncate" style={{ color: v3.ink }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-[12px] truncate" style={{ color: v3.inkSoft }}>
              {subtitle}
            </div>
          )}
        </div>
        {rightSlot}
      </div>
    </div>
  );
}
