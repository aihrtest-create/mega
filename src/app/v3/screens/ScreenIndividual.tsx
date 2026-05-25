import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useV3 } from "../state";
import { v3 } from "../theme";
import {
  SHOWS,
  MASTER_CLASSES,
  EXTRAS,
  SERVICES,
  CAKES,
  ENTRY_TICKET_PRICE,
  PATIROOM_HOURLY_RATE,
} from "../data";
import { TopBar } from "../components/TopBar";
import { BottomBar } from "../components/BottomBar";
import { SectionTitle, formatPrice, Stepper } from "../components/UI";
import { ItemCard } from "../components/ItemCard";
import { HeroPicker } from "../components/HeroPicker";
import { SectionTabs } from "../components/SectionTabs";

const TABS = [
  { id: "base",  label: "Билеты и патирум" },
  { id: "anim",  label: "Анимация" },
  { id: "show",  label: "Шоу" },
  { id: "mc",    label: "Мастер-классы" },
  { id: "extra", label: "Доп.активности" },
  { id: "svc",   label: "Услуги" },
  { id: "cake",  label: "Торт" },
];

export function ScreenIndividual() {
  const { state, update, setScreen, totalPrice, basePrice, toggleId } = useV3();

  const dateLabel = state.date
    ? `${format(state.date, "d MMMM", { locale: ru })} · ${state.time}`
    : "";

  return (
    <div className="min-h-screen pb-32" style={{ background: v3.bg }}>
      <TopBar
        onBack={() => setScreen("package")}
        title="Свой набор"
        subtitle={dateLabel}
      />

      <SectionTabs tabs={TABS} />

      {/* Base price banner */}
      <div className="max-w-lg mx-auto px-3 pt-3">
        <div
          className="rounded-[24px] px-4 py-3.5 flex items-center justify-between gap-3"
          style={{ background: v3.lavender }}
        >
          <div className="min-w-0">
            <div className="text-[16px] font-extrabold mb-0.5" style={{ color: v3.purpleDeep }}>
              Свой набор
            </div>
            <p className="text-[12px]" style={{ color: v3.purpleDeep, opacity: 0.7 }}>
              {state.childrenCount} детей · патирум {state.individualPatiroomHours} ч
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[18px] font-extrabold tabular-nums" style={{ color: v3.purpleDeep }}>
              {formatPrice(basePrice)}
            </div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: v3.purpleDeep, opacity: 0.6 }}>
              билеты + патирум
            </div>
          </div>
        </div>
      </div>

      {/* ── Base ──────────────────── */}
      <SectionTitle id="base" caption="Стоимость рассчитывается автоматически">
        Билеты и патирум
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "white", border: "1.5px solid #EFEAFA" }}>
          <div>
            <div className="text-[15px] font-bold" style={{ color: v3.ink }}>
              Входные безлимитные билеты
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: v3.inkSoft }}>
              {formatPrice(ENTRY_TICKET_PRICE)} × {state.childrenCount} детей
            </div>
          </div>
          <div className="text-[15px] font-extrabold tabular-nums" style={{ color: v3.purpleDeep }}>
            {formatPrice(state.childrenCount * ENTRY_TICKET_PRICE)}
          </div>
        </div>
        <div className="rounded-2xl p-4 flex items-center justify-between gap-3" style={{ background: "white", border: "1.5px solid #EFEAFA" }}>
          <div className="min-w-0">
            <div className="text-[15px] font-bold" style={{ color: v3.ink }}>
              Аренда патирума
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: v3.inkSoft }}>
              {formatPrice(PATIROOM_HOURLY_RATE)}/час
            </div>
          </div>
          <Stepper
            value={state.individualPatiroomHours}
            min={1}
            max={6}
            onDec={() =>
              update({
                individualPatiroomHours: Math.max(1, state.individualPatiroomHours - 1),
              })
            }
            onInc={() =>
              update({
                individualPatiroomHours: Math.min(6, state.individualPatiroomHours + 1),
              })
            }
          />
        </div>
      </div>

      {/* ── Animation ─────────────── */}
      <SectionTitle id="anim" caption="Опционально: добавьте героя или тематический квест">
        Анимация и квест
      </SectionTitle>
      <div className="max-w-lg mx-auto px-3">
        <HeroPicker
          animatorId={state.animatorId}
          questId={state.questId}
          onPickAnimator={(id) => update({ animatorId: id, questId: null })}
          onPickQuest={(id) => update({ questId: id, animatorId: null })}
          onClear={() => update({ animatorId: null, questId: null })}
        />
        <p className="text-[11px] mt-2 px-2" style={{ color: v3.inkMuted }}>
          В индивидуальном формате анимация добавляется отдельной услугой.
          Стоимость подскажет менеджер.
        </p>
      </div>

      {/* ── Shows ─────────────────── */}
      <SectionTitle id="show">Шоу-программа</SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {SHOWS.map((s) => {
          const sel = state.extraShowIds.includes(s.id);
          return (
            <ItemCard
              key={s.id}
              title={s.name}
              imageSrc={s.image}
              price={s.basePrice}
              priceLabel={`+ ${formatPrice(s.basePrice)}`}
              badge={s.badge}
              selected={sel}
              onToggle={() => toggleId("extraShowIds", s.id)}
            />
          );
        })}
      </div>

      {/* ── Master classes ─────── */}
      <SectionTitle id="mc">Мастер-классы</SectionTitle>
      <div className="max-w-lg mx-auto px-3 space-y-2">
        {MASTER_CLASSES.map((m) => {
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

      {/* ── Extras ────────────── */}
      <SectionTitle id="extra">Дополнительные активности</SectionTitle>
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

      {/* ── Services ──────────── */}
      <SectionTitle id="svc">Дополнительные услуги</SectionTitle>
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

      {/* ── Cake ──────────────── */}
      <SectionTitle id="cake">Праздничный торт</SectionTitle>
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
        caption={`${state.childrenCount} детей · свой набор`}
        onClick={() => setScreen("summary")}
      />
    </div>
  );
}
