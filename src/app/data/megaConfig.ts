export type ParkId = "hello" | "mega";

export const MEGA_PACKAGE_PRICES: Record<string, [number, number]> = {
  basic: [24900, 34900],
  premium: [39900, 49900],
  exclusive: [65900, 69900],
};

export const MEGA_ROOM_DETAILS: Record<string, { label: string; hours: number }> = {
  basic: { label: "Фиджитал Патирум — 2,5 часа", hours: 2.5 },
  premium: { label: "Фиджитал Патирум — 2,5 часа", hours: 2.5 },
  exclusive: { label: "Фиджитал Патирум — 3 часа", hours: 3 },
};

export const MEGA_MC_PRICE = 15000;

export const MEGA_SHOW_PRICES: Record<string, number> = {
  soap: 16000,
  paper: 15000,
  tesla: 15000,
  professor: 18000,
};

export const MEGA_SHOW_NAMES: Record<string, string> = {
  soap: "Шоу мыльных пузырей",
  paper: "Бумажное шоу",
  tesla: "Научное шоу",
  professor: "Шоу неоновых подушек",
};

export interface MegaFoodItem {
  id: string;
  name: string;
  price: number;
  subtitle?: string;
  details: string[];
  image?: string;
}

export interface MegaFoodCategory {
  id: string;
  title: string;
  icon: string;
  note?: string;
  items: MegaFoodItem[];
}

export const MEGA_FOOD_CATEGORIES: MegaFoodCategory[] = [
  {
    id: "udc",
    title: "Комбо-обеды UDCкафе",
    icon: "🍟",
    note: "Расчет на 8 детей",
    items: [
      {
        id: "mega_udc_1",
        name: "UDC Обед #1",
        price: 8120,
        subtitle: "Наггетсы, фри, кесадилья",
        details: [
          "Наггетсы + сырный соус — 4 порции",
          "Картофель фри + кетчуп — 8 порций",
          "Кесадилья с курицей + сметана — 2 порции",
        ],
        image: "/images/food/mega_udc_1.png",
      },
      {
        id: "mega_udc_2",
        name: "UDC Обед #2",
        price: 8200,
        subtitle: "Кесадилья, наггетсы, шашлычок",
        details: [
          "Кесадилья с курицей + сметана — 2 порции",
          "Наггетсы + сырный соус — 4 порции",
          "Куриный шашлычок + кетчуп + фри — 8 порций",
        ],
        image: "/images/food/mega_udc_2.png",
      },
      {
        id: "mega_udc_3",
        name: "UDC Обед #3",
        price: 9700,
        subtitle: "Горячее комбо с фруктовой тарелкой",
        details: [
          "Куриный шашлычок + кетчуп + фри — 8 порций",
          "Наггетсы + сырный соус — 4 порции",
          "Кесадилья с курицей + сметана — 2 порции",
          "Фруктовая тарелка",
        ],
        image: "/images/food/mega_udc_3.png",
      },
    ],
  },
  {
    id: "osterio",
    title: "Комбо-обеды Osterio Mario",
    icon: "🍕",
    note: "Расчет на 8 детей",
    items: [
      {
        id: "mega_osterio_1",
        name: "Osterio Обед #1",
        price: 6280,
        subtitle: "Наггетсы, фри, пицца маргарита",
        details: [
          "Наггетсы + сырный соус — 6 порций",
          "Картофель фри + кетчуп — 8 порций",
          "Пицца маргарита — 4 порции",
        ],
        image: "/images/food/mega_osterio_1.png",
      },
      {
        id: "mega_osterio_2",
        name: "Osterio Обед #2",
        price: 7640,
        subtitle: "Пицца с ветчиной, овощи, наггетсы, фри",
        details: [
          "Пицца с ветчиной — 4 порции",
          "Хрустящие овощные палочки — 4 порции",
          "Наггетсы + сырный соус — 6 порций",
          "Картофель фри + кетчуп — 8 порций",
        ],
        image: "/images/food/mega_osterio_2.png",
      },
      {
        id: "mega_osterio_3",
        name: "Osterio Обед #3",
        price: 9400,
        subtitle: "Овощи, наггетсы, фри и две пиццы",
        details: [
          "Хрустящие овощные палочки — 4 порции",
          "Наггетсы + сырный соус — 6 порций",
          "Картофель фри + кетчуп — 8 порций",
          "Пицца с ветчиной — 4 порции",
          "Пицца маргарита — 4 порции",
        ],
        image: "/images/food/mega_osterio_3.png",
      },
    ],
  },
  {
    id: "drinks",
    title: "Напитки парка",
    icon: "🥤",
    items: [
      { id: "mega_drink_mors_1l", name: "Морс", price: 340, subtitle: "1000 мл", details: ["Вкус: клюква"] },
      { id: "mega_drink_water_500", name: "Вода в ассортименте б/г", price: 140, subtitle: "500 мл", details: [] },
      { id: "mega_drink_water_kids", name: "Вода детская", price: 90, subtitle: "330 мл", details: [] },
      { id: "mega_drink_cola", name: "Кола", price: 190, subtitle: "500 мл", details: [] },
      { id: "mega_drink_juice_1l", name: "Сок в ассортименте", price: 250, subtitle: "1000 мл", details: ["Мультифрукт, вишня-рябина, яблоко, апельсин"] },
      { id: "mega_drink_juice_kids", name: "Сок детский", price: 100, subtitle: "200 мл", details: ["Мультифрукт, яблоко"] },
      { id: "mega_drink_ice_tea_500", name: "Чай холодный", price: 170, subtitle: "500 мл", details: ["Зеленый, черный с лимоном"] },
      { id: "mega_drink_espresso", name: "Эспрессо", price: 120, subtitle: "30 мл", details: [] },
      { id: "mega_drink_americano", name: "Американо", price: 120, subtitle: "180 мл", details: [] },
      { id: "mega_drink_cappuccino", name: "Капучино", price: 190, subtitle: "200 мл", details: [] },
      { id: "mega_drink_latte", name: "Латте", price: 190, subtitle: "200 мл", details: [] },
      { id: "mega_drink_hot_tea", name: "Чай в ассортименте", price: 290, subtitle: "1000 мл", details: [] },
    ],
  },
];

export function findMegaFoodItem(itemId: string) {
  for (const category of MEGA_FOOD_CATEGORIES) {
    const item = category.items.find((candidate) => candidate.id === itemId);
    if (item) return item;
  }
  return null;
}

export function getMegaFoodTotal(selection: Record<string, number>) {
  return Object.entries(selection).reduce((sum, [itemId, qty]) => {
    if (qty <= 0) return sum;
    const item = findMegaFoodItem(itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}
