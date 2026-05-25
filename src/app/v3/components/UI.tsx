import React from "react";
import { Minus, Plus } from "lucide-react";
import { v3 } from "../theme";

export function formatPrice(n: number): string {
  if (n <= 0) return "0 ₽";
  return `${n.toLocaleString("ru-RU").replace(/,/g, " ")} ₽`;
}

// ──────────────────────────────────────────────
// Pill — small colored tag (Хит! / Топ! / Эксклюзив etc.)
// ──────────────────────────────────────────────
export function Pill({
  children,
  bg = v3.greenTag,
  color = v3.greenTagText,
  className = "",
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${className}`}
      style={{ background: bg, color }}
    >
      {children}
    </span>
  );
}

// ──────────────────────────────────────────────
// Quantity stepper — like Yandex Lavka cart
// ──────────────────────────────────────────────
export function Stepper({
  value,
  onDec,
  onInc,
  min,
  max,
  bg = v3.lavender,
  ink = v3.purpleDeep,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  min?: number;
  max?: number;
  bg?: string;
  ink?: string;
}) {
  const decDisabled = min !== undefined && value <= min;
  const incDisabled = max !== undefined && value >= max;
  return (
    <div
      className="inline-flex items-center rounded-full p-1 select-none"
      style={{ background: bg }}
    >
      <button
        type="button"
        onClick={onDec}
        disabled={decDisabled}
        className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
        style={{ color: ink }}
      >
        <Minus className="w-4 h-4" strokeWidth={3} />
      </button>
      <span
        className="min-w-10 text-center text-sm font-bold tabular-nums"
        style={{ color: ink }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onInc}
        disabled={incDisabled}
        className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
        style={{ color: ink }}
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Round add/remove button on item card
// ──────────────────────────────────────────────
export function AddButton({
  active,
  onClick,
  size = 36,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className="rounded-full flex items-center justify-center font-bold transition-all active:scale-90"
      style={{
        width: size,
        height: size,
        background: active ? v3.purpleDeep : "white",
        color: active ? "white" : v3.purpleDeep,
        boxShadow: active
          ? "0 4px 14px rgba(91, 46, 190, 0.35)"
          : "0 2px 8px rgba(0,0,0,0.10)",
        border: active ? "none" : "1.5px solid #E5DCF5",
      }}
      aria-label={active ? "Убрать" : "Добавить"}
    >
      {active ? <Minus className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" strokeWidth={3} />}
    </button>
  );
}

// ──────────────────────────────────────────────
// Section heading
// ──────────────────────────────────────────────
export function SectionTitle({
  children,
  caption,
  id,
}: {
  children: React.ReactNode;
  caption?: string;
  id?: string;
}) {
  return (
    <div id={id} className="px-5 pt-6 pb-3 scroll-mt-24">
      <h2 className="text-[22px] font-extrabold leading-tight" style={{ color: v3.purpleDeep }}>
        {children}
      </h2>
      {caption && (
        <p className="text-[13px] mt-1" style={{ color: v3.inkSoft }}>
          {caption}
        </p>
      )}
    </div>
  );
}
