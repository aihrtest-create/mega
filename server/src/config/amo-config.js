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

import crypto from 'crypto';

export const CONFIGURATOR_URL = process.env.CONFIGURATOR_URL || 'https://party.hello-park.io/mega/';

const SECRET_SALT = process.env.LEAD_SIGN_SECRET || 'hello-park-mega-secret-salt-2026';

export function signLeadId(leadId) {
  return crypto
    .createHmac('sha256', SECRET_SALT)
    .update(String(leadId))
    .digest('hex')
    .substring(0, 16);
}

// Returns true when the id looks like an AmoCRM lead id (digits only)
export function isAmoLeadId(id) {
  return typeof id === 'string' && /^\d+$/.test(id);
}

export function buildConfiguratorUrl(amoLeadId) {
  const base = CONFIGURATOR_URL.replace(/\/+$/, '');
  const sig = signLeadId(amoLeadId);
  return `${base}/?lead=${amoLeadId}&sig=${sig}`;
}
