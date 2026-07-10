import { AMO_FIELDS, buildConfiguratorUrl } from '../config/amo-config.js';


const PACKAGE_LABELS = {
  basic: "Базовый",
  premium: "Премиум",
  exclusive: "Эксклюзив",
  custom: "Собери сам",
};

const QUEST_LABELS = {
  phygital_voxels: "Фиджитал: Воксели",
  phygital_space: "Фиджитал: Космическое путешествие",
  classic_fort: "Классика: Форт Боярд",
  classic_minecraft: "Классика: Майнкрафт",
  classic_squid: "Классика: Игра в кальмара",
  classic_barbie: "Классика: Барби",
  classic_safari: "Классика: Сафари",
  classic_harry: "Классика: Гарри Поттер",
  classic_heroes: "Классика: Супергерои",
  classic_bloggers: "Классика: Блогеры",
  classic_fortnite: "Классика: Fortnite",
  classic_agents: "Классика: Агенты",
  classic_harley: "Классика: Харли Квин",
  animator: "Герой",
  none: "Без квеста",
};

const PATIROOM_LABELS = {
  mega_room: "Фиджитал Патирум",
  mechta: "Мечта (12 мест)",
  kometa: "Комета (16 мест)",
  arcada: "Аркада (16 мест)",
  pixels: "Пиксели (12 мест)",
};

const CAFE_ZONE_LABELS = {
  cafe_round: "Круглый стол",
  cafe_small: "Маленький столик",
  cafe_pink: "За шторками",
  cafe_pink_full: "Вся зона за шторками",
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

const ANIMATORS_LABELS = {
  "elsa": "Эльза",
  "anna": "Анна",
  "ariel": "Ариэль",
  "rapunzel": "Рапунцель",
  "aurora": "Аврора",
  "snow_white": "Белоснежка",
  "jasmine": "Жасмин",
  "cinderella": "Золушка",
  "moana": "Моана",
  "minnie_mouse": "Минни Маус",
  "barbie": "Барби",
  "lol_queen_bee": "Королева Пчёлка",
  "lol_doll": "Кукла L.O.L.",
  "lol_unicorn": "Фея-Единорог",
  "rainbow_dash": "Радуга Дэш",
  "princess_cadence": "Принцесса Каденс",
  "spiderman": "Человек-Паук",
  "batman": "Бэтмен",
  "captain_america": "Капитан Америка",
  "superman": "Супермен",
  "deadpool": "Дэдпул",
  "optimus_prime": "Оптимус Прайм",
  "wednesday": "Уэнсдей",
  "enid": "Энид",
  "maleficent": "Малефисента",
  "cruella": "Круэлла",
  "huggy_wuggy": "Хаги Ваги",
  "kissy_missy": "Киси Миси",
  "darth_vader": "Дарт Вейдер",
  "chase": "Чейз",
  "skye": "Скай",
  "kuromi": "Куроми",
  "hello_kitty": "Hello Kitty",
  "naruto": "Наруто",
  "pikachu": "Пикачу",
  "alice": "Алиса",
  "maui": "Мауи",
  "donatello": "Донателло",
  "michelangelo": "Микеланджело",
  "raphael": "Рафаэль",
  "minecraft_creeper": "Крипер",
  "green_creeper": "Зелёный Крипер",
  "brawl_leon": "Леон",
  "brawl_shelly": "Шелли",
  "sonic": "Соник",
  "mario": "Марио",
  "roblox_girl": "Девочка Роблокс",
  "roblox_boy": "Мальчик Роблокс",
  "roblox_blue": "Блю Роблокс",
  "harry_potter": "Гарри Поттер",
  "hermione": "Гермиона",
  "ken": "Кен",
  "squid_game": "Охранник",
  "blogger": "Блогерша",
  "blogger_male": "Блогер",
  "pirate": "Пират",
  "pirate_girl": "Пиратка",
  "host": "Ведущий",
  "pop_it": "Pop It",
  "paleontologist": "Палеонтолог",
  "footballer": "Футболист",
  "dragon": "Дракоша",
  "unicorn": "Единорожка",
  "jester": "Шут",
  "circus_bunny": "Цирковой зайка",
  "circus_artist1": "Цирковой артист",
  "circus_artist2": "Цирковой артист"
};


function fmtPrice(n) {
  return new Intl.NumberFormat('ru-RU').format(n || 0) + ' ₽';
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

function listOrDash(arr, mapper = (v) => v) {
  if (!arr || arr.length === 0) return '—';
  return arr.map(mapper).join(', ');
}

export function buildAmoNoteText(state) {
  const lines = [];
  lines.push('🎂 Конфигуратор заполнен клиентом');
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`Пакет: ${PACKAGE_LABELS[state.packageType] || '—'}`);
  if (state.questType) lines.push(`Квест: ${QUEST_LABELS[state.questType] || state.questType}`);
  
  if (state.patiroom) {
    const room = PATIROOM_LABELS[state.patiroom] || state.patiroom;
    lines.push(`Патирум: ${room}${state.patiroomHours ? ` × ${state.patiroomHours} ч.` : ''}`);
  }
  
  if (state.cafeZones?.length) {
    lines.push(`Зоны кафе: ${listOrDash(state.cafeZones, (z) => CAFE_ZONE_LABELS[z] || z)}`);
  }
  
  if (state.animators?.length) {
    lines.push(`Ведущие: ${listOrDash(state.animators, (a) => ANIMATORS_LABELS[a] || a)}`);
  }
  
  if (state.premiumCostume) lines.push(`Премиум-костюм: ${state.premiumCostume}`);
  
  if (state.shows?.length) {
    lines.push(`Шоу: ${listOrDash(state.shows, (s) => SHOW_LABELS[s] || s)}`);
  }
  
  if (state.masterClasses?.length) {
    lines.push(`Мастер-классы: ${listOrDash(state.masterClasses, (m) => MC_LABELS[m] || m)}`);
  }

  lines.push('');
  
  // Mega Food logic
  if (state.megaOwnCatering) {
    lines.push(`Питание: Свой кейтеринг`);
  } else if (state.megaFood && Object.keys(state.megaFood).length) {
    const items = Object.entries(state.megaFood).filter(([, q]) => q > 0).map(([id, q]) => `${id} × ${q}`);
    if (items.length) {
      lines.push(`Еда (Mega): \n  - ${items.join('\n  - ')}`);
    } else {
      lines.push(`Питание: нет`);
    }
  } else if (state.customFood || typeof state.includeFood !== 'undefined') {
    // Fallback for classic configurator
    lines.push(`Питание (детский набор): ${state.includeFood ? 'да' : 'нет'}`);
    if (state.customFood && Object.keys(state.customFood).length) {
      const items = Object.entries(state.customFood).filter(([, q]) => q > 0).map(([id, q]) => `${id}×${q}`);
      if (items.length) lines.push(`Доп. еда: ${items.join(', ')}`);
    }
  }

  if (state.cakeChoice) {
    lines.push(`Торт: ${state.cakeChoice}${state.fillingChoice ? ` (начинка: ${state.fillingChoice})` : ''}`);
    if (state.cakeCustomText) lines.push(`  пожелание к торту: ${state.cakeCustomText}`);
  }

  if (state.discoChoice) lines.push(`Финал: ${ADDITIONAL_LABELS[state.discoChoice] || (state.discoChoice === 'disco' ? 'Дискотека' : 'Trash-box')}`);
  if (state.balloonChoice) lines.push(`Сюрприз: ${state.balloonChoice === 'balloon' ? 'Шар-сюрприз' : 'Пиньята'}`);

  if (state.additionalActivities?.length) {
    lines.push(`Доп. активности: ${listOrDash(state.additionalActivities, (a) => ADDITIONAL_LABELS[a] || a)}`);
  }
  
  if (state.additionalServices?.length) {
    lines.push(`Доп. услуги: ${listOrDash(state.additionalServices, (s) => ADDITIONAL_LABELS[s] || s)}`);
  }

  lines.push('');
  lines.push(`Дата: ${fmtDate(state.date)}${state.time ? `, ${state.time}` : ''}`);
  lines.push(`Гости: ${state.childrenCount ?? 0} детей, ${state.adultsCount ?? 0} взрослых`);
  if (state.contactComment) lines.push(`Комментарий клиента: ${state.contactComment}`);

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 Итого: ${fmtPrice(state.totalPrice)}`);

  return lines.join('\n');
}

export function buildAmoFieldUpdates(state, amoLeadId) {
  const customFields = [];

  if (state.date) {
    const ts = Math.floor(new Date(state.date).getTime() / 1000);
    if (!Number.isNaN(ts)) {
      customFields.push({ field_id: AMO_FIELDS.EVENT_DATE, values: [{ value: ts }] });
    }
  }

  if (typeof state.childrenCount === 'number') {
    customFields.push({ field_id: AMO_FIELDS.KIDS_COUNT, values: [{ value: state.childrenCount }] });
  }
  if (typeof state.adultsCount === 'number') {
    customFields.push({ field_id: AMO_FIELDS.ADULTS_COUNT, values: [{ value: state.adultsCount }] });
  }

  if (amoLeadId) {
    customFields.push({
      field_id: AMO_FIELDS.CONFIG_LINK,
      values: [{ value: buildConfiguratorUrl(amoLeadId) }],
    });
  }

  const payload = { custom_fields_values: customFields };
  if (typeof state.totalPrice === 'number' && state.totalPrice > 0) {
    payload.price = Math.round(state.totalPrice);
  }
  return payload;
}
