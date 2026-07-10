const fs = require('fs');

const animatorsFile = fs.readFileSync('src/app/components/step3-animators.tsx', 'utf8');
const animatorsMap = {};
const regex = /\{ id: "([^"]+)", name: "([^"]+)"/g;
let match;
while ((match = regex.exec(animatorsFile)) !== null) {
  animatorsMap[match[1]] = match[2];
}

const amoFormatFile = fs.readFileSync('server/src/services/amo-format.js', 'utf8');
let newAmoFormat = amoFormatFile;

// Inject the maps
const injection = `
const PACKAGE_LABELS = {
  basic: 'Базовый',
  premium: 'Премиум',
  exclusive: 'Эксклюзив',
  custom: 'Собери сам',
};

const QUEST_LABELS = {
  phygital_voxels: 'Фиджитал: Воксели',
  phygital_space: 'Фиджитал: Космическое путешествие',
  classic_fort: 'Классика: Форт Боярд',
  classic_minecraft: 'Классика: Майнкрафт',
  classic_squid: 'Классика: Игра в кальмара',
  classic_barbie: 'Классика: Барби',
  classic_safari: 'Классика: Сафари',
  classic_harry: 'Классика: Гарри Поттер',
  classic_heroes: 'Классика: Супергерои',
  classic_bloggers: 'Классика: Блогеры',
  classic_fortnite: 'Классика: Fortnite',
  classic_agents: 'Классика: Агенты',
  classic_harley: 'Классика: Харли Квин',
  animator: 'Герой',
  none: 'Без квеста',
};

const PATIROOM_LABELS = {
  mega_room: 'Фиджитал Патирум',
  mechta: 'Мечта (12 мест)',
  kometa: 'Комета (16 мест)',
  arcada: 'Аркада (16 мест)',
  pixels: 'Пиксели (12 мест)',
};

const CAFE_ZONE_LABELS = {
  cafe_round: 'Круглый стол',
  cafe_small: 'Маленький столик',
  cafe_pink: 'За шторками',
  cafe_pink_full: 'Вся зона за шторками',
};

const MC_LABELS = {
  elsa_tiara: "Диадема Эльзы",
  felt_toy: "Игрушка из фетра",
  kapitoshka: "Капитошка",
  mc_weapon: "Оружие из Майнкрафта",
  birthday_card: "Открытка имениннику",
  sand_picture: "Песочная картина",
  gingerbread: "Роспись пряников",
  slime: "Создание слайма",
  jewelry: "Трендовые украшения",
  pinwheel: "Игрушка-ветерок",
  twisting: "Твистинг",
  mc_soap: "Мыловарение",
  mc_tshirts: "Роспись футболок",
  mc_dreamcatcher: "Ловец снов",
  mc_culinary: "Кулинарный мастер-класс",
  mc_florarium: "Флорариум",
  mc_ebru: "Эбру",
  mc_icecream: "Приготовление мороженого",
  mc_chocolate: "Шоколадные конфеты",
  mc_aquarium: "Аквариум с живой рыбкой",
  mc_harry_wand: "Палочка Гарри Поттера"
};

const SHOW_LABELS = {
  soap: "Шоу мыльных пузырей",
  paper: "Бумажное шоу",
  tesla: "Научное шоу",
  professor: "Шоу неоновых подушек",
  neon_soap: "Шоу неоновых мыльных пузырей",
  neon_paper: "Неоновое бумажное шоу",
  ribbon: "Ленточное шоу",
  illusionist: "Фокусник-иллюзионист",
  cryo: "Крио-шоу с мороженым",
  animals: "Шоу с животными"
};

const ADDITIONAL_LABELS = {
  "trash-box": "Трэш-коробка",
  "trash-animals": "Трэш-коробка с животными",
  "mini-disco": "Мини-диско",
  "challenge-party": "Челлендж-пати",
  "surprise-balloon": "Шар-сюрприз",
  "pinata": "Пиньята",
  "photo": "Фотограф",
  "aqua": "Аквагрим",
  "tattoos": "Детские тату"
};

const ANIMATORS_LABELS = ${JSON.stringify(animatorsMap, null, 2)};
`;

// Replace from line 3 to 38
newAmoFormat = newAmoFormat.replace(/const PACKAGE_LABELS = \{[\s\S]*?const CAFE_ZONE_LABELS = \{[\s\S]*?\};\n/, injection);

fs.writeFileSync('server/src/services/amo-format.js', newAmoFormat);
console.log('Dictionaries updated!');
