import React, { useEffect, useRef, useState } from "react";
import { v3 } from "../theme";

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  // ids of section <div>s in the page
}

// Sticky horizontal tabs that scroll the page to the section + highlight on scroll.
// Inspired by Dodo / Lavka tab bars.
export function SectionTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0]?.id);
  const containerRef = useRef<HTMLDivElement>(null);

  // Observe sections to highlight active tab on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [tabs]);

  // Scroll the active tab into the visible part of the tab strip
  useEffect(() => {
    if (!containerRef.current || !active) return;
    const btn = containerRef.current.querySelector(`[data-tab='${active}']`) as HTMLElement | null;
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      className="sticky top-[60px] z-30"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div
        ref={containerRef}
        className="max-w-lg mx-auto flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2.5"
      >
        {tabs.map((t) => {
          const sel = active === t.id;
          return (
            <button
              key={t.id}
              data-tab={t.id}
              onClick={() => goTo(t.id)}
              className="shrink-0 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all active:scale-95"
              style={{
                background: sel ? v3.purpleDeep : "#F5F0FF",
                color: sel ? "white" : v3.purpleDeep,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
