import React from "react";
import { getPublicUrl } from "./SlideShows";

interface CateringCombo {
  id: string;
  name: string;
  partner: string;
  partnerBadgeBg: string;
  price: string;
  subtitle: string;
  items: string[];
  image: string;
}

const COMBOS: CateringCombo[] = [
  {
    id: "udc_1",
    name: "UDC Обед #1",
    partner: "UDCкафе",
    partnerBadgeBg: "#FF6022",
    price: "8 120 ₽",
    subtitle: "Наггетсы, картофель фри, кесадилья",
    items: [
      "Наггетсы + сырный соус — 4 порции",
      "Картофель фри + кетчуп — 8 порций",
      "Кесадилья с курицей + сметана — 2 порции",
    ],
    image: "/images/food/mega_udc_1.webp",
  },
  {
    id: "udc_3",
    name: "UDC Обед #3 (VIP)",
    partner: "UDCкафе",
    partnerBadgeBg: "#FF6022",
    price: "9 700 ₽",
    subtitle: "Горячее комбо с фруктовой тарелкой",
    items: [
      "Куриный шашлычок + фри — 8 порций",
      "Наггетсы + сырный соус — 4 порции",
      "Кесадилья с курицей — 2 порции",
      "Фруктовая тарелка",
    ],
    image: "/images/food/mega_udc_3.webp",
  },
  {
    id: "osteria_2",
    name: "Osteria Обед #2",
    partner: "Osteria Mario",
    partnerBadgeBg: "#00897B",
    price: "7 640 ₽",
    subtitle: "Римская пицца, овощи, наггетсы",
    items: [
      "Пицца с ветчиной — 4 порции",
      "Хрустящие овощные палочки — 4 порции",
      "Наггетсы + сырный соус — 6 порций",
      "Картофель фри + кетчуп — 8 порций",
    ],
    image: "/images/food/mega_osterio_2.webp",
  },
];

export function SlideCatering() {
  return (
    <div
      className="relative w-full aspect-[16/9] bg-white text-[#101010] select-none overflow-hidden font-cy"
      style={{
        fontFamily: "'Cy Grotesk', 'Cy Grotesk Grand', 'Unbounded', 'Gilroy', 'Onest', sans-serif",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between px-[5.2%] pt-[3.8%] pb-[3.2%]">
        {/* Header */}
        <div className="w-full flex items-start justify-between">
          <div>
            <h1
              className="text-[#5822E5] font-black tracking-[-0.03em] leading-[1.05]"
              style={{
                fontSize: "clamp(28px, 4.2vw, 66px)",
                fontWeight: 900,
              }}
            >
              Праздничный кейтеринг
            </h1>
          </div>
          <div className="bg-gray-100 px-[1.2vw] py-[0.4vw] rounded-full text-[0.85vw] font-black text-gray-700">
            🍕 Меню от партнеров • Расчет на 8 детей
          </div>
        </div>

        {/* 3 Combo Cards */}
        <div className="w-full grid grid-cols-3 gap-[2.4vw] my-auto items-stretch h-[72%]">
          {COMBOS.map((combo) => {
            const resolvedImg = getPublicUrl(combo.image);
            return (
              <div
                key={combo.id}
                className="relative rounded-[24px] sm:rounded-[30px] p-[1.6vw] border border-gray-200 bg-[#FAFAFC] shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-[#FF6022]/40"
              >
                <div>
                  {/* Partner Badge & Price */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white font-black text-[0.7vw] px-[0.8vw] py-[0.3vw] rounded-full uppercase"
                      style={{ backgroundColor: combo.partnerBadgeBg }}
                    >
                      {combo.partner}
                    </span>
                    <span className="text-black font-black text-[1.4vw] leading-none">
                      {combo.price}
                    </span>
                  </div>

                  {/* Combo Title */}
                  <h3 className="text-[#101010] font-black text-[1.5vw] leading-tight mt-[0.6vw]">
                    {combo.name}
                  </h3>
                  <p className="text-[#FF6022] font-extrabold text-[0.8vw] mt-[0.1vw]">
                    {combo.subtitle}
                  </p>

                  {/* Items list */}
                  <ul className="mt-[0.8vw] space-y-[0.3vw] text-left">
                    {combo.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-gray-700 font-medium text-[0.8vw] leading-snug flex items-start gap-[0.4vw]"
                      >
                        <span className="text-[#FF6022] font-black">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Photo Preview Thumbnail */}
                <div className="w-full h-[6.5vw] rounded-[16px] overflow-hidden bg-gray-200 mt-[0.8vw]">
                  <img
                    src={resolvedImg}
                    alt={combo.name}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("/mega/")) {
                        target.src = `/mega${combo.image}`;
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="w-full flex justify-end items-end pt-[0.4vw]">
          <p className="text-[#9E9EA7] font-medium text-[0.85vw] tracking-normal text-right">
            Также доступен заказ праздничных напитков (морс, соки) и авторских тортов!
          </p>
        </div>
      </div>
    </div>
  );
}
