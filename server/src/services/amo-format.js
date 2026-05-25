import { AMO_FIELDS, buildConfiguratorUrl } from '../config/amo-config.js';

const PACKAGE_LABELS = {
  basic: 'Базовый',
  premium: 'Премиум',
  exclusive: 'Эксклюзив',
  custom: 'Свой набор',
};

const QUEST_LABELS = {
  phygital_voxels: 'Фиджитал: Воксели',
  phygital_space: 'Фиджитал: Космическое путешествие',
  classic_fort: 'Классика: Форт',
  classic_minecraft: 'Классика: Майнкрафт',
  classic_squid: 'Классика: Игра в кальмара',
  classic_barbie: 'Классика: Барби',
  classic_safari: 'Классика: Сафари',
  classic_harry: 'Классика: Гарри Поттер',
  classic_heroes: 'Классика: Супергерои',
  classic_bloggers: 'Классика: Блогеры',
  classic_fortnite: 'Классика: Fortnite',
  classic_agents: 'Классика: Агенты',
  none: 'Без квеста',
};

const PATIROOM_LABELS = {
  mechta: 'Мечта (12 мест)',
  kometa: 'Комета (16 мест)',
  arcada: 'Аркада (16 мест)',
  pixels: 'Пиксели (12 мест)',
};

const CAFE_ZONE_LABELS = {
  cafe_round: 'Круглый стол (до 8 чел.)',
  cafe_small: 'Малая зона',
  cafe_pink: 'Розовые шторки (до 10 чел.)',
  cafe_pink_full: 'Розовые шторки целиком',
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
  if (state.animators?.length) lines.push(`Аниматоры: ${listOrDash(state.animators)}`);
  if (state.premiumCostume) lines.push(`Премиум-костюм: ${state.premiumCostume}`);
  if (state.shows?.length) lines.push(`Шоу: ${listOrDash(state.shows)}`);
  if (state.masterClasses?.length) lines.push(`Мастер-классы: ${listOrDash(state.masterClasses)}`);

  lines.push('');
  lines.push(`Питание (детский набор): ${state.includeFood ? 'да' : 'нет'}`);
  if (state.customFood && Object.keys(state.customFood).length) {
    const items = Object.entries(state.customFood).filter(([, q]) => q > 0).map(([id, q]) => `${id}×${q}`);
    if (items.length) lines.push(`Доп. еда: ${items.join(', ')}`);
  }
  if (state.cakeChoice) {
    lines.push(`Торт: ${state.cakeChoice}${state.fillingChoice ? ` (начинка: ${state.fillingChoice})` : ''}`);
    if (state.cakeCustomText) lines.push(`  пожелание к торту: ${state.cakeCustomText}`);
  }
  if (state.discoChoice) lines.push(`Финал: ${state.discoChoice === 'disco' ? 'Дискотека' : 'Trash-box'}`);
  if (state.balloonChoice) lines.push(`Сюрприз: ${state.balloonChoice === 'balloon' ? 'Шар-сюрприз' : 'Пиньята'}`);

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
