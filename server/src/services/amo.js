import 'dotenv/config';

const SUBDOMAIN = process.env.AMO_SUBDOMAIN;
const TOKEN = process.env.AMO_LONG_TOKEN;
const BASE = `https://${SUBDOMAIN}.amocrm.ru/api/v4`;

if (!SUBDOMAIN || !TOKEN) {
  console.warn('[AMO] AMO_SUBDOMAIN или AMO_LONG_TOKEN не заданы в .env — клиент работать не будет');
}

async function request(method, path, body) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const err = new Error(`AmoCRM ${method} ${path} → ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const amo = {
  request,
  getAccount: () => request('GET', '/account'),
  listPipelines: () => request('GET', '/leads/pipelines'),
  listLeadCustomFields: () => request('GET', '/leads/custom_fields?limit=250'),
  listContactCustomFields: () => request('GET', '/contacts/custom_fields?limit=250'),
  getLead: (id) => request('GET', `/leads/${id}?with=contacts`),
  getContact: (id) => request('GET', `/contacts/${id}`),
  findContactByQuery: (q) => request('GET', `/contacts?query=${encodeURIComponent(q)}`),
  addNoteToLead: (leadId, text) =>
    request('POST', `/leads/${leadId}/notes`, [{ note_type: 'common', params: { text } }]),
  updateLead: (leadId, payload) => request('PATCH', `/leads/${leadId}`, payload),
};
