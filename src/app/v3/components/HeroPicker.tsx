import React, { useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { v3 } from "../theme";
import { ANIMATORS, ANIMATOR_CATEGORIES, QUESTS } from "../data";

interface Props {
  animatorId: string | null;
  questId: string | null;
  onPickAnimator: (id: string) => void;
  onPickQuest: (id: string) => void;
  onClear: () => void;
}

// Bottom sheet to pick a hero or a themed quest.
export function HeroPicker({ animatorId, questId, onPickAnimator, onPickQuest, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"animator" | "quest">(animatorId ? "animator" : questId ? "quest" : "animator");

  const animator = ANIMATORS.find((a) => a.id === animatorId);
  const quest = QUESTS.find((q) => q.id === questId);

  const summary =
    animator?.name ||
    quest?.name ||
    "Выберите героя или квест";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left rounded-2xl p-3 flex items-center gap-3 transition-all active:scale-[0.99]"
        style={{
          background: animator || quest ? v3.lavender : "white",
          border: `1.5px solid ${animator || quest ? v3.lavenderDeep : "#EFEAFA"}`,
        }}
      >
        <div
          className="w-14 h-14 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
          style={{ background: "#F5F0FF" }}
        >
          {animator ? (
            <img src={animator.image} alt="" className="w-full h-full object-cover" />
          ) : quest ? (
            <img src={quest.image} alt="" className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-2xl">🎭</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: v3.inkSoft }}>
            Анимация и квест
          </div>
          <div className="text-[15px] font-bold mt-0.5 truncate" style={{ color: v3.ink }}>
            {summary}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: v3.inkSoft }}>
            Включено в пакет — выберите один вариант
          </div>
        </div>
        <ChevronRight className="w-5 h-5 shrink-0" style={{ color: v3.purpleDeep }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-[61] rounded-t-[28px] max-h-[88vh] flex flex-col"
              style={{ background: "white" }}
            >
              <div className="flex items-center justify-center pt-2 pb-1">
                <span className="w-10 h-1.5 rounded-full" style={{ background: "#E5DCF5" }} />
              </div>
              <div className="px-5 pb-3 flex items-center justify-between">
                <h3 className="text-[20px] font-extrabold" style={{ color: v3.purpleDeep }}>
                  Анимация и квест
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: v3.lavender, color: v3.purpleDeep }}
                  aria-label="Закрыть"
                >
                  <X className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-5 pb-3">
                <div
                  className="rounded-full p-1 flex"
                  style={{ background: "#F1ECFF" }}
                >
                  {[
                    { id: "animator", label: "Любимый герой" },
                    { id: "quest", label: "Тематический квест" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id as "animator" | "quest")}
                      className="flex-1 py-2 rounded-full text-[13.5px] font-bold transition-all"
                      style={{
                        background: tab === t.id ? v3.purpleDeep : "transparent",
                        color: tab === t.id ? "white" : v3.purpleDeep,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-6">
                {tab === "animator" ? (
                  <div className="space-y-4">
                    {ANIMATOR_CATEGORIES.map((cat) => {
                      const items = ANIMATORS.filter((a) => a.category === cat.id);
                      if (items.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <h4 className="text-[13px] font-extrabold mb-2 uppercase tracking-wide" style={{ color: v3.inkSoft }}>
                            {cat.label}
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {items.map((a) => {
                              const sel = animatorId === a.id;
                              return (
                                <button
                                  key={a.id}
                                  onClick={() => {
                                    onPickAnimator(a.id);
                                    setOpen(false);
                                  }}
                                  className="rounded-2xl overflow-hidden text-left active:scale-95 transition-transform relative"
                                  style={{
                                    background: sel ? v3.lavender : "white",
                                    border: `1.5px solid ${sel ? v3.lavenderDeep : "#EFEAFA"}`,
                                  }}
                                >
                                  <div className="aspect-[4/5] overflow-hidden" style={{ background: "#F5F0FF" }}>
                                    <img src={a.image} alt={a.name} className="w-full h-full object-cover" loading="lazy" />
                                  </div>
                                  <div className="p-2 text-[12px] font-bold leading-tight" style={{ color: v3.ink }}>
                                    {a.name}
                                  </div>
                                  {sel && (
                                    <span
                                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                                      style={{ background: v3.purpleDeep }}
                                    >
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-[11.5px] pt-2" style={{ color: v3.inkMuted }}>
                      В каталоге больше 200 героев — это популярные. Полный список у менеджера.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {QUESTS.map((q) => {
                      const sel = questId === q.id;
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            onPickQuest(q.id);
                            setOpen(false);
                          }}
                          className="w-full text-left rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-transform"
                          style={{
                            background: sel ? v3.lavender : "white",
                            border: `1.5px solid ${sel ? v3.lavenderDeep : "#EFEAFA"}`,
                          }}
                        >
                          <div
                            className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                            style={{ background: "#F5F0FF" }}
                          >
                            <img src={q.image} alt={q.name} className="w-full h-full object-contain p-1" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-bold" style={{ color: v3.ink }}>
                              {q.name}
                            </div>
                            <p className="text-[12px] mt-0.5 leading-snug line-clamp-2" style={{ color: v3.inkSoft }}>
                              {q.description}
                            </p>
                          </div>
                          {sel && (
                            <span
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: v3.purpleDeep }}
                            >
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {(animatorId || questId) && (
                <div className="px-5 pt-2 pb-5 border-t" style={{ borderColor: "#EFEAFA" }}>
                  <button
                    onClick={() => {
                      onClear();
                      setOpen(false);
                    }}
                    className="w-full py-3 rounded-full text-[14px] font-bold"
                    style={{ background: "#F5F0FF", color: v3.purpleDeep }}
                  >
                    Сбросить выбор
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
