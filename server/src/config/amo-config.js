// AmoCRM-specific constants for the Hello Park configurator integration

export const AMO_PIPELINES = {
  MEGA: 6047530,
};

export const AMO_STAGES = {
  MEGA_SEND_CONFIG: 85640278, // «Отправить конфигуратор»
};

// Custom field IDs (lead) — pulled from listLeadCustomFields()
export const AMO_FIELDS = {
  EVENT_DATE: 998595,        // «Дата праздника» (date)
  KIDS_COUNT: 998741,        // «Детей» (numeric)
  ADULTS_COUNT: 998791,      // «Взрослых» (numeric)
  CONFIG_LINK: 1328901,      // «Ссылка на банкетный лист» (url) — кладём ссылку на смету
};

export const CONFIGURATOR_URL = process.env.CONFIGURATOR_URL || 'https://aihrtest-create.github.io/planner-park/';

// Returns true when the id looks like an AmoCRM lead id (digits only)
export function isAmoLeadId(id) {
  return typeof id === 'string' && /^\d+$/.test(id);
}

export function buildConfiguratorUrl(amoLeadId) {
  const base = CONFIGURATOR_URL.replace(/\/+$/, '');
  return `${base}/?lead=${amoLeadId}`;
}
