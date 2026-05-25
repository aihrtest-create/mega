import React, { useMemo } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useV3 } from "../state";
import { v3, PACKAGE_TINTS } from "../theme";
import {
  PACKAGES,
  SHOWS,
  MASTER_CLASSES,
  EXTRAS,
  SERVICES,
  CAKES,
} from "../data";
import { TopBar } from "../components/TopBar";
import { BottomBar } from "../components/BottomBar";
import { SectionTitle, formatPrice, Pill } from "../components/UI";
import { ItemCard } from "../components/ItemCard";
import { HeroPicker } from "../components/HeroPicker";
import { SectionTabs } from "../components/SectionTabs";

const TABS = [
  { id: "anim",   label: "Анимация" },
  { id: "show",   label: "Шоу" },
  { id: "mc",     label: "Мастер-классы" },
  { id: "extra",  label: "Доп.активности" },
  { id: "svc",    label: "Услуги" },
  { id: "cake",   label: "Торт" },
];

export function ScreenCustomize() {
  const {
    state,
    update,
    setScreen,
    isWeekendBooking,
    basePrice,
    totalPrice,
    toggleId,
  } = useV3();

  const pkg = useMemo(
    () => PACKAGES.find((p) => p.id === state.packageId),
    [state.packageId],
  );
  if (!pkg) return null;
  const tint = PACKAGE_TINTS[pkg.id];

  const handlePickAnimator = (id: string) => update({ animatorId: id, questId: null });
  const handlePickQuest = (id: string) => update({ questId: id, animatorId: null });
  const clearHero = () => update({ animatorId: null, questId: null });

  const dateLabel = state.date
    ? `${format(state.date, "d MMMM", { locale: ru })} · ${state.time}`
    : "";

  return (
    <div className="min-h-screen pb-32" style={{ background: v3.bg }}>
      <TopBar
        onBack={() => setScreen("package")}
        title={`Пакет ${pkg.name}`}
        subtitle={dateLabel}
      />

      <SectionTabs tabs={TABS} />

      {/* Package summary banner */}
      <div className="max-w-lg mx-auto px-3 pt-3">
        <div
          className="rounded-[24px] px-4 py-3.5 flex items-center justify-between gap-3"
          style={{ background: tint.fill }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[16px] font-extrabold" style={{ color: tint.ink }}>
                {pkg.name}
              </span>
              {pkg.badge === "hit" && (
                <Pill bg={v3.greenTag} color={v3.greenTagText}>ХИТ</Pill>
              )}
            </div>
            <p className="text-[12px]" style={{ color: tint.ink, opacity: 0.7 }}>
              {pkg.features.length} услуг включено · {state.childrenCount} детей
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[18px] font-extrabold tabular-nums" style={{ color: tint.ink }}>
              {formatPrice(basePrice)}
            </div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: tint.ink, opacity: 0.6 }}>
              {isWeekendBooking ? "выходной" : "будни"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Animation section ───────────────── */}
      <SectionTitle id="anim" caption="Один герой или один тематический квест уже включены в пакет">
        Анимация и квест
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3">
        <HeroPicker
          animatorId={state.animatorId}
          questId={state.questId}
          onPickAnimator={handlePickAnimator}
          onPickQuest={handlePickQuest}
          onClear={clearHero}
        />
      </div>

      {/* ── Shows section ───────────────────── */}
      <SectionTitle
        id="show"
        caption={
          pkg.includedShow
            ? "Одно шоу включено — выберите его, остальные за доплату"
            : "Эффектное шоу для самой запоминающейся минуты праздника"
        }
      >
        Шоу-программа
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {pkg.includedShow && (
          <div className="rounded-2xl px-4 py-3 mb-1" style={{ background: v3.cream }}>
            <div className="text-[12px] font-bold mb-2 uppercase tracking-wide" style={{ color: v3.orange }}>
              Включено в пакет
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SHOWS.slice(0, 4).map((s) => {
                const sel = state.includedShowId === s.id;
                return (
                  <ItemCard
                    key={s.id}
                    title={s.name}
                    imageSrc={s.image}
                    price={0}
                    priceLabel={sel ? "Выбрано" : "Включено"}
                    selected={sel}
                    badge={s.badge}
                    variant="tile"
                    onToggle={() => update({ includedShowId: sel ? null : s.id })}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className="text-[12px] font-bold mt-1 mb-2 px-2 uppercase tracking-wide" style={{ color: v3.inkSoft }}>
          {pkg.includedShow ? "Дополнительно" : "Шоу на выбор"}
        </div>
        {SHOWS.map((s) => {
          const sel = state.extraShowIds.includes(s.id);
          // For Exclusive, surcharge applies; otherwise full price
          const displayPrice = pkg.id === "exclusive" ? s.exclusiveSurcharge : s.basePrice;
          const priceLabel =
            pkg.id === "exclusive" && s.exclusiveSurcharge === 0 ? "Включено" : `+ ${formatPrice(displayPrice)}`;
          // skip the chosen included show in dop list to avoid confusion
          if (pkg.includedShow && state.includedShowId === s.id) return null;
          return (
            <ItemCard
              key={s.id}
              title={s.name}
              imageSrc={s.image}
              price={displayPrice}
              priceLabel={priceLabel}
              badge={s.badge}
              selected={sel}
              onToggle={() => toggleId("extraShowIds", s.id)}
            />
          );
        })}
      </div>

      {/* ── Master classes ──────────────────── */}
      <SectionTitle
        id="mc"
        caption={
          pkg.includedMasterClass
            ? "Один мастер-класс включён — выберите его, остальные за доплату"
            : "Каждый ребёнок забирает результат с собой"
        }
      >
        Мастер-классы
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {pkg.includedMasterClass && (
          <div className="rounded-2xl px-4 py-3 mb-1" style={{ background: v3.cream }}>
            <div className="text-[12px] font-bold mb-2 uppercase tracking-wide" style={{ color: v3.orange }}>
              Включено в пакет — выберите один
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MASTER_CLASSES.slice(0, 6).map((m) => {
                const sel = state.includedMasterClassId === m.id;
                return (
                  <ItemCard
                    key={m.id}
                    title={m.name}
                    imageSrc={m.image}
                    price={0}
                    priceLabel={sel ? "Выбрано" : "Включено"}
                    selected={sel}
                    badge={m.badge}
                    variant="tile"
                    onToggle={() => update({ includedMasterClassId: sel ? null : m.id })}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className="text-[12px] font-bold mt-1 mb-2 px-2 uppercase tracking-wide" style={{ color: v3.inkSoft }}>
          {pkg.includedMasterClass ? "Дополнительные мастер-классы" : "Мастер-классы на выбор"}
        </div>
        {MASTER_CLASSES.map((m) => {
          if (pkg.includedMasterClass && state.includedMasterClassId === m.id) return null;
          const sel = state.extraMasterClassIds.includes(m.id);
          return (
            <ItemCard
              key={m.id}
              title={m.name}
              description={m.description}
              imageSrc={m.image}
              price={m.basePrice}
              priceLabel={`+ ${formatPrice(m.basePrice)}`}
              badge={m.badge}
              selected={sel}
              onToggle={() => toggleId("extraMasterClassIds", m.id)}
            />
          );
        })}
      </div>

      {/* ── Extra activities ────────────────── */}
      <SectionTitle id="extra" caption="Усильте программу яркими моментами">
        Дополнительные активности
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {EXTRAS.map((e) => {
          const sel = state.extraIds.includes(e.id);
          return (
            <ItemCard
              key={e.id}
              title={e.name}
              description={e.description}
              emoji={e.emoji}
              price={e.price}
              priceLabel={`+ ${formatPrice(e.price)}`}
              meta={e.duration}
              selected={sel}
              onToggle={() => toggleId("extraIds", e.id)}
            />
          );
        })}
      </div>

      {/* ── Services ────────────────────────── */}
      <SectionTitle id="svc" caption="Профессионалы для лучшего результата">
        Дополнительные услуги
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {SERVICES.map((s) => {
          const sel = state.serviceIds.includes(s.id);
          return (
            <ItemCard
              key={s.id}
              title={s.name}
              description={s.description}
              emoji={s.emoji}
              price={s.price}
              priceLabel={`+ ${formatPrice(s.price)}`}
              meta={s.meta}
              selected={sel}
              onToggle={() => toggleId("serviceIds", s.id)}
            />
          );
        })}
      </div>

      {/* ── Cake ────────────────────────────── */}
      <SectionTitle id="cake" caption="Торжественный вынос аниматором уже включён">
        Праздничный торт
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {CAKES.map((c) => {
          const sel = state.cakeId === c.id;
          return (
            <ItemCard
              key={c.id}
              title={c.name}
              description={c.description}
              emoji={c.id === "partner" ? "🎂" : "🎁"}
              price={c.price}
              priceLabel={`+ ${formatPrice(c.price)}`}
              selected={sel}
              onToggle={() => update({ cakeId: sel ? null : c.id })}
            />
          );
        })}
      </div>

      <BottomBar
        label="К оформлению"
        price={totalPrice}
        caption={`${state.childrenCount} детей · ${pkg.name}`}
        onClick={() => setScreen("summary")}
        disabled={!state.animatorId && !state.questId}
      />
    </div>
  );
}
