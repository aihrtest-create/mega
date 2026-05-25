// Catalog data for V3 — derived from Hello Park "Праздничные предложения" PDF (03.2026)
// All prices in ₽.

export type PackageId = "basic" | "premium" | "exclusive" | "individual";

export interface PackageInfo {
  id: Exclude<PackageId, "individual">;
  name: string;
  tagline: string;
  weekdayPrice: number;
  weekendPrice: number;
  badge?: "hit"; // ХИТ ПРОДАЖ
  features: string[];
  // What's included that user can configure (animator, MC, show)
  includedAnimator: boolean;
  includedQuest: boolean;
  includedMasterClass: boolean;
  includedShow: boolean;
  includedDisco: "mini" | "trash_or_disco" | null;
  includedSurprise: "balloon" | "balloon_or_pinata" | null;
  includedGiftAll: boolean;
}

export const PACKAGES: PackageInfo[] = [
  {
    id: "basic",
    name: "Базовый",
    tagline: "Готовый праздник с подарком",
    weekdayPrice: 24900,
    weekendPrice: 34900,
    features: [
      "Безлимитные входные билеты",
      "Анимация с любимым героем или квест на выбор",
      "Фиджитал Патирум",
      "Украшение шарами и сервировка",
      "Мультимедийное поздравление от Лиса Рокки",
      "Вынос торта аниматором",
      "Стилизованные пригласительные",
      "Мини-дискотека",
      "Подарок имениннику",
    ],
    includedAnimator: true,
    includedQuest: true,
    includedMasterClass: false,
    includedShow: false,
    includedDisco: "mini",
    includedSurprise: null,
    includedGiftAll: false,
  },
  {
    id: "premium",
    name: "Премиум",
    tagline: "Самый популярный пакет",
    weekdayPrice: 39900,
    weekendPrice: 49900,
    badge: "hit",
    features: [
      "Безлимитные входные билеты",
      "Анимация с любимым героем или квест на выбор",
      "Фиджитал Патирум",
      "Украшение шарами и сервировка",
      "Мультимедийное поздравление от Лиса Рокки",
      "Вынос торта аниматором",
      "Стилизованные пригласительные",
      "Трэш-коробка или дискотека",
      "Супер-подарок имениннику",
      "Фиджитал мастер-класс на выбор",
      "Шар-сюрприз с наполнением",
    ],
    includedAnimator: true,
    includedQuest: true,
    includedMasterClass: true,
    includedShow: false,
    includedDisco: "trash_or_disco",
    includedSurprise: "balloon",
    includedGiftAll: false,
  },
  {
    id: "exclusive",
    name: "Эксклюзив",
    tagline: "Праздник по полной программе",
    weekdayPrice: 65900,
    weekendPrice: 69900,
    features: [
      "Безлимитные входные билеты",
      "Анимация с любимым героем или квест на выбор",
      "Фиджитал Патирум",
      "Украшение шарами и сервировка",
      "Мультимедийное поздравление от Лиса Рокки",
      "Вынос торта аниматором",
      "Стилизованные пригласительные",
      "Трэш-коробка или дискотека",
      "Супер-подарок имениннику",
      "Фиджитал мастер-класс на выбор",
      "Шар-сюрприз или Пиньята",
      "Подарки всем гостям",
      "Шоу-программа на выбор",
    ],
    includedAnimator: true,
    includedQuest: true,
    includedMasterClass: true,
    includedShow: true,
    includedDisco: "trash_or_disco",
    includedSurprise: "balloon_or_pinata",
    includedGiftAll: true,
  },
];

// ──────────────────────────────────────────────
// Animators / Heroes (curated subset from existing catalog)
// ──────────────────────────────────────────────
export interface AnimatorItem {
  id: string;
  name: string;
  category: "princess" | "hero" | "villain" | "cartoon" | "game";
  image: string;
}

export const ANIMATORS: AnimatorItem[] = [
  { id: "elsa",         name: "Эльза",            category: "princess", image: "/animators/cropped/elsa.webp" },
  { id: "anna",         name: "Анна",             category: "princess", image: "/animators/cropped/anna.webp" },
  { id: "rapunzel",     name: "Рапунцель",        category: "princess", image: "/animators/cropped/rapunzel.webp" },
  { id: "barbie",       name: "Барби",            category: "princess", image: "/animators/cropped/barbie.webp" },
  { id: "moana",        name: "Моана",            category: "princess", image: "/animators/cropped/moana.webp" },
  { id: "ariel",        name: "Ариэль",           category: "princess", image: "/animators/cropped/ariel.webp" },
  { id: "spiderman",    name: "Человек-Паук",     category: "hero",     image: "/animators/cropped/spiderman.webp" },
  { id: "batman",       name: "Бэтмен",           category: "hero",     image: "/animators/cropped/batman.webp" },
  { id: "superman",     name: "Супермен",         category: "hero",     image: "/animators/cropped/superman.webp" },
  { id: "captain_america", name: "Капитан Америка", category: "hero",  image: "/animators/cropped/captain_america.webp" },
  { id: "wednesday",    name: "Уэнсдей",          category: "villain",  image: "/animators/cropped/wednesday.webp" },
  { id: "huggy_wuggy",  name: "Хаги Ваги",        category: "villain",  image: "/animators/cropped/huggy_wuggy.webp" },
  { id: "cruella",      name: "Круэлла",          category: "villain",  image: "/animators/cropped/cruella.webp" },
  { id: "kissy_missy",  name: "Киси Миси",        category: "villain",  image: "/animators/cropped/kissy_missy.webp" },
  { id: "chase",        name: "Чейз",             category: "cartoon",  image: "/animators/cropped/chase.webp" },
  { id: "skye",         name: "Скай",             category: "cartoon",  image: "/animators/cropped/skye.webp" },
  { id: "pikachu",      name: "Пикачу",           category: "cartoon",  image: "/animators/cropped/pikachu.webp" },
  { id: "minecraft",    name: "Майнкрафт",        category: "game",     image: "/animators/cropped/minecraft_creeper.webp" },
  { id: "mario",        name: "Марио",            category: "game",     image: "/animators/cropped/mario.webp" },
  { id: "naruto",       name: "Наруто",           category: "game",     image: "/animators/cropped/naruto.webp" },
];

export const ANIMATOR_CATEGORIES: { id: AnimatorItem["category"]; label: string }[] = [
  { id: "princess", label: "Принцессы" },
  { id: "hero",     label: "Супергерои" },
  { id: "villain",  label: "Антигерои" },
  { id: "cartoon",  label: "Мульт-герои" },
  { id: "game",     label: "Игры" },
];

// ──────────────────────────────────────────────
// Themed quests
// ──────────────────────────────────────────────
export interface QuestItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const QUESTS: QuestItem[] = [
  {
    id: "harry",
    name: "Гарри Поттер",
    description: "Магический мир, викторина, лабиринт и квиддич",
    image: "/quests/transparent/new_classic_harry.png",
  },
  {
    id: "harley",
    name: "Харли Квин",
    description: "Безумный отряд антигероев и съёмка клипа",
    image: "/quests/transparent/new_classic_harley.png",
  },
  {
    id: "minecraft",
    name: "Майнкрафт",
    description: "Сами куём оружие, сражаемся с эндерменами",
    image: "/quests/transparent/new_classic_minecraft.png",
  },
  {
    id: "fort",
    name: "Форт Боярд",
    description: "Паутинные лабиринты, ключи и сокровищница",
    image: "/quests/transparent/new_classic_fort.png",
  },
  {
    id: "bloggers",
    name: "Блогеры",
    description: "Спасаем соцсети от таинственного Анонима",
    image: "/quests/transparent/new_classic_bloggers.png",
  },
];

// ──────────────────────────────────────────────
// Shows
// ──────────────────────────────────────────────
export interface ShowItem {
  id: string;
  name: string;
  basePrice: number;       // standalone price
  exclusiveSurcharge: number; // surcharge if Эксклюзив "free choice"
  badge?: "hit" | "top";
  image: string;
}

export const SHOWS: ShowItem[] = [
  { id: "neon_pillows", name: "Шоу неоновых подушек",      basePrice: 18000, exclusiveSurcharge: 0,     image: "/shows/neon.png"  },
  { id: "science",      name: "Научное шоу",                basePrice: 15000, exclusiveSurcharge: 0,     image: "/shows/science.png" },
  { id: "paper",        name: "Бумажное шоу",               basePrice: 16000, exclusiveSurcharge: 0,     image: "/shows/paper.png" },
  { id: "soap",         name: "Шоу мыльных пузырей",        basePrice: 15000, exclusiveSurcharge: 0,     image: "/shows/soap.png"  },
  { id: "neon_soap",    name: "Шоу неоновых мыльных пузырей", basePrice: 16000, exclusiveSurcharge: 4000,  image: "/shows/soap.png"  },
  { id: "neon_paper",   name: "Неоновое бумажное шоу",      basePrice: 18000, exclusiveSurcharge: 7000,  image: "/shows/paper.png", badge: "top" },
  { id: "ribbon",       name: "Ленточное шоу",              basePrice: 18000, exclusiveSurcharge: 7000,  image: "/shows/neon.png"  },
  { id: "animals",      name: "Фокус-программа с животными",basePrice: 35000, exclusiveSurcharge: 25000, image: "/shows/professor.webp" },
  { id: "illusionist",  name: "Фокусник-иллюзионист",       basePrice: 30000, exclusiveSurcharge: 16000, image: "/shows/tesla.webp" },
  { id: "cryo",         name: "Крио-шоу с мороженым",       basePrice: 20000, exclusiveSurcharge: 5000,  image: "/shows/science.png", badge: "hit" },
];

// ──────────────────────────────────────────────
// Master classes
// ──────────────────────────────────────────────
export interface MasterClassItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  premiumSurcharge: number;  // surcharge if Premium/Exclusive included MC
  image: string;
  badge?: "hit";
}

export const MASTER_CLASSES: MasterClassItem[] = [
  { id: "slime",      name: "Слаймы",            description: "Дети мешают и тянут разноцветные слаймы",     basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/slime.webp" },
  { id: "gingerbread",name: "Роспись пряников",  description: "Раскрашиваем пряники глазурью и посыпкой",    basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/gingerbread.webp" },
  { id: "pinwheel",   name: "Игрушка-ветерок",   description: "Собираем крутящуюся игрушку из бумаги",      basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/pinwheel.png" },
  { id: "twisting",   name: "Твистинг",          description: "Скручиваем фигурки из шариков-колбасок",    basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/twisting.png" },
  { id: "elsa_tiara", name: "Корона Эльзы",      description: "Украшаем сказочную корону блёстками",       basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/elsa_tiara.webp" },
  { id: "sand",       name: "Песочная картина",  description: "Цветной песок по трафарету",                basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/sand_picture.webp" },
  { id: "mc_weapon",  name: "Оружие Майнкрафт",  description: "Конструируем тематическое оружие из пены",  basePrice: 15000, premiumSurcharge: 0,     image: "/masterclasses/mc_weapon.webp" },
  { id: "soap_make",  name: "Мыловарение",        description: "Варим ароматное цветное мыло",              basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/jewelry.webp" },
  { id: "tshirt",     name: "Роспись футболок",   description: "Создаём свой принт на футболке",            basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/birthday_card.webp" },
  { id: "dreamcatch", name: "Ловец снов",         description: "Плетём ловец снов с перьями и бусинами",    basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/felt_toy.webp" },
  { id: "florarium",  name: "Флорариум",          description: "Маленький сад в стеклянной банке",          basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/sand_picture.webp" },
  { id: "ebru",       name: "Эбру",              description: "Рисуем красками на воде",                   basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/birthday_card.webp" },
  { id: "icecream",   name: "Приготовление мороженого", description: "Варим домашнее мороженое",          basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/kapitoshka.webp" },
  { id: "chocolate",  name: "Шоколадные конфеты", description: "Создаём конфеты с разными начинками",      basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/gingerbread.webp" },
  { id: "aquarium",   name: "Аквариум с рыбкой",  description: "Каждый ребёнок забирает свой аквариум",    basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/jewelry.webp" },
  { id: "cooking",    name: "Кулинарный мастер-класс", description: "Готовим с шеф-поваром",              basePrice: 24000, premiumSurcharge: 18000, image: "/masterclasses/gingerbread.webp" },
  { id: "wand",       name: "Палочка Гарри Поттера", description: "Создаём волшебную палочку",             basePrice: 15000, premiumSurcharge: 10000, image: "/masterclasses/mc_weapon.webp", badge: "hit" },
];

// ──────────────────────────────────────────────
// Extra activities
// ──────────────────────────────────────────────
export interface ExtraItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  emoji: string;
}

export const EXTRAS: ExtraItem[] = [
  { id: "trash_animals", name: "Трэш-коробка с животными", description: "«Форт Боярд» наугад: угадываем зверя на ощупь", price: 35000, duration: "60 мин", emoji: "🦝" },
  { id: "trash_box",     name: "Трэш-коробка",             description: "Загадочная игра «Угадай, что в ящике»",       price: 7000,  duration: "30 мин", emoji: "📦" },
  { id: "minidisco",     name: "Мини-дискотека",           description: "Зажигательные танцы под любимые треки",       price: 6000,  duration: "30 мин", emoji: "🪩" },
  { id: "challenge",     name: "Челлендж-пати",            description: "Необычные испытания на скорость и смелость",   price: 10000, duration: "60 мин", emoji: "🏆" },
];

// ──────────────────────────────────────────────
// Services
// ──────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  meta: string;
  emoji: string;
}

export const SERVICES: ServiceItem[] = [
  { id: "photographer", name: "Hello Фотограф", description: "Профессиональный репортаж и обработка", price: 7000, meta: "60 мин · 40–50 фото", emoji: "📸" },
  { id: "aquagrim",     name: "Hello Аквагрим", description: "Бабочки, супергерои, единороги — на лицах детей", price: 7000, meta: "60 мин · до 10 человек", emoji: "🎨" },
];

// ──────────────────────────────────────────────
// Cake (mock)
// ──────────────────────────────────────────────
export interface CakeOption {
  id: "partner" | "own";
  name: string;
  description: string;
  price: number;
}

export const CAKES: CakeOption[] = [
  { id: "partner", name: "Торт от партнёра",   description: "Большой выбор бисквитов, начинок и декора",     price: 8400 },
  { id: "own",     name: "Свой торт",           description: "Доплата за подачу торта аниматором",            price: 2000 },
];

// ──────────────────────────────────────────────
// Time slots — hourly from 11:00 to 19:00
// ──────────────────────────────────────────────
export const TIME_SLOTS = ["11:00", "13:00", "15:00", "17:00", "19:00"];

// ──────────────────────────────────────────────
// Per-child entry ticket — for "Индивидуальный" mode
// ──────────────────────────────────────────────
export const ENTRY_TICKET_PRICE = 1200; // ₽ per child (mock)
export const PATIROOM_HOURLY_RATE = 3000; // ₽/h
