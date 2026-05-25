const STATUS_LABELS = {
  new:'Новый', bot_connected:'В боте', link_sent:'Ссылка отправлена',
  configuring:'Заполняет', submitted:'✅ Заявка', contacted:'Связались', confirmed:'Подтверждён'
};
const PKG = { basic:'Базовый', premium:'Премиум', exclusive:'Эксклюзив', custom:'Индивидуальный' };

let allLeads=[], currentFilter='all', currentLeadId=null;

async function loadLeads() {
  try {
    const r = await fetch('/api/leads');
    const d = await r.json();
    allLeads = d.leads || [];
    renderStats(d.stats || []);
    renderFilters(d.stats || []);
    renderTable();
  } catch(e) { console.error(e); }
}

function renderStats(stats) {
  const sc = k => (stats.find(s=>s.status===k)||{}).count||0;
  document.getElementById('stats-bar').innerHTML = [
    ['Всего лидов', allLeads.length, ''],
    ['Новые заявки', sc('submitted'), 'orange'],
    ['Заполняют', sc('configuring'), 'blue'],
    ['Подтверждено', sc('confirmed'), 'green'],
  ].map(([l,v,c])=>`<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value ${c}">${v}</div></div>`).join('');
}

function renderFilters(stats) {
  const sc = k => (stats.find(s=>s.status===k)||{}).count||0;
  const fs = [
    ['all','Все',allLeads.length],['submitted','✅ Заявки',sc('submitted')],
    ['configuring','Заполняют',sc('configuring')],['new','Новые',sc('new')],
    ['link_sent','Ссылка отправлена',sc('link_sent')],['contacted','Связались',sc('contacted')],
    ['confirmed','Подтверждено',sc('confirmed')]
  ];
  document.getElementById('filters').innerHTML = fs.map(([k,l,c])=>
    `<button class="filter-btn ${currentFilter===k?'active':''}" onclick="setFilter('${k}')">${l}<span class="filter-count">${c}</span></button>`
  ).join('');
}

function setFilter(f) { currentFilter=f; loadLeads(); }

function renderTable() {
  const list = currentFilter==='all' ? allLeads : allLeads.filter(l=>l.status===currentFilter);
  if(!list.length) {
    document.getElementById('leads-table').innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">📭</div>Нет заявок</div></td></tr>';
    return;
  }
  document.getElementById('leads-table').innerHTML = list.map(l => {
    const cfg = l.config_data ? JSON.parse(l.config_data) : null;
    const ico = l.messenger==='telegram' ? '💬' : '📱';
    return `<tr onclick="openLead('${l.id}')">
      <td><span class="lead-name">${esc(l.name)}</span></td>
      <td><a class="phone-link" href="tel:${l.phone}" onclick="event.stopPropagation()">${esc(l.phone)}</a></td>
      <td>${ico} ${l.messenger==='telegram'?'Telegram':'Max'}</td>
      <td><span class="status-badge status-${l.status}"><span class="status-dot"></span>${STATUS_LABELS[l.status]||l.status}</span></td>
      <td><span class="time-ago">${timeAgo(l.created_at)}</span></td>
      <td>${cfg?.totalPrice ? `<span class="total-price">${Number(cfg.totalPrice).toLocaleString('ru-RU')} ₽</span>` : '—'}</td>
    </tr>`;
  }).join('');
}

function openLead(id) {
  currentLeadId=id;
  const l = allLeads.find(x=>x.id===id); if(!l) return;
  const cfg = l.config_data ? JSON.parse(l.config_data) : null;
  document.getElementById('modal-title').textContent = `${l.name} — ${STATUS_LABELS[l.status]}`;
  
  let h = `<div class="detail-grid">
    <div><div class="detail-label">Контакт</div><div>${esc(l.name)}</div><a class="phone-link" href="tel:${l.phone}">${esc(l.phone)}</a></div>
    <div><div class="detail-label">Мессенджер</div><div>${l.messenger==='telegram'?'💬 Telegram':'📱 Max'}</div>${l.bot_username?`<div style="color:#71717A">@${esc(l.bot_username)}</div>`:''}</div>
  </div>`;
  
  if(cfg?.packageType) {
    h += `<div class="detail-label">Конфигурация</div><div style="margin-bottom:12px"><span class="total-price">${Number(cfg.totalPrice||0).toLocaleString('ru-RU')} ₽</span></div><div class="detail-grid">`;
    const ci = (l,v) => `<div class="config-item"><div class="config-item-label">${l}</div><div class="config-item-value">${esc(String(v))}</div></div>`;
    h += ci('Пакет', PKG[cfg.packageType]||cfg.packageType);
    if(cfg.questType&&cfg.questType!=='none') h += ci('Квест', cfg.questType);
    if(cfg.date) h += ci('Дата', cfg.date);
    if(cfg.time) h += ci('Время', cfg.time);
    h += ci('Дети', cfg.childrenCount||'—');
    h += ci('Взрослые', cfg.adultsCount||'—');
    if(cfg.animators?.length) h += ci('Аниматоры', cfg.animators.join(', '));
    if(cfg.shows?.length) h += ci('Шоу', cfg.shows.join(', '));
    if(cfg.masterClasses?.length) h += ci('МК', cfg.masterClasses.join(', '));
    if(cfg.patiroomDetails) h += ci('Патирум', cfg.patiroomDetails);
    if(cfg.cakeChoice) h += ci('Торт', cfg.cakeChoice);
    h += '</div>';
    if(cfg.contactComment) h += `<div class="detail-label" style="margin-top:16px">Комментарий</div><div style="color:#E4E4E7;font-size:14px">${esc(cfg.contactComment)}</div>`;
  }
  
  h += `<div style="margin-top:20px"><div class="detail-label">Заметки менеджера</div>
    <textarea class="notes-input" id="manager-notes" placeholder="Добавьте заметку...">${esc(l.manager_notes||'')}</textarea></div>`;
  
  // Chat Section
  h += `<div class="chat-section">
    <div class="detail-label">Переписка (через бота)</div>
    <div class="chat-messages" id="chat-messages">Загрузка...</div>
    <div id="chat-preview-bar" class="chat-preview-bar" style="display:none"></div>
    <div class="chat-input-wrap">
      <button class="chat-btn-attach" onclick="document.getElementById('chat-file-input').click()" title="Прикрепить файл">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <input type="file" id="chat-file-input" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar" onchange="handleFileSelect(this)">
      <textarea class="chat-input" id="chat-input" rows="1" placeholder="Напишите клиенту..." oninput="autoResizeInput(this); updateSendBtn()" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage()}"></textarea>
      <button class="chat-btn-send disabled" id="chat-send-btn" onclick="sendChatMessage()" title="Отправить">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>`;

  document.getElementById('modal-body').innerHTML = h;
  loadChatMessages(id);
  
  let a = `<button class="btn btn-secondary" onclick="saveNotes()">💾 Сохранить</button>`;
  if(l.status==='submitted') a += `<button class="btn btn-primary" onclick="markStatus('contacted')">📞 Связался</button>`;
  if(l.status==='contacted') a += `<button class="btn btn-success" onclick="markStatus('confirmed')">✅ Подтвердить</button>`;
  document.getElementById('modal-actions').innerHTML = a;
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); currentLeadId=null; }

async function saveNotes() {
  if(!currentLeadId) return;
  await fetch(`/api/leads/${currentLeadId}/notes`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({notes:document.getElementById('manager-notes').value}) });
  loadLeads();
}

async function markStatus(status) {
  if(!currentLeadId) return;
  await fetch(`/api/leads/${currentLeadId}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) });
  closeModal(); loadLeads();
}

async function loadChatMessages(id) {
  try {
    const r = await fetch(`/api/leads/${id}/events`);
    const d = await r.json();
    const chat = document.getElementById('chat-messages');
    if(!chat) return;

    const messages = d.events.filter(e => ['client_message', 'manager_message', 'lead_created'].includes(e.event_type));
    
    if(!messages.length) {
      chat.innerHTML = '<div style="color:#52525B; font-size:12px; text-align:center">Нет сообщений</div>';
      return;
    }

    chat.innerHTML = messages.map(m => {
      const isManager = m.event_type === 'manager_message';
      const isSystem = m.event_type === 'lead_created';
      const cls = isManager ? 'msg-manager' : (isSystem ? '' : 'msg-client');
      const label = isSystem ? 'Создана заявка' : (isManager ? 'Вы' : 'Клиент');
      
      if(isSystem) return `<div style="text-align:center; font-size:10px; color:#52525B; margin:8px 0">${label}</div>`;

      return `<div class="msg ${cls}">
        <div style="font-size:10px; opacity:0.7; margin-bottom:4px">${label}</div>
        ${esc(m.event_data)}
        <span class="msg-time">${new Date(m.created_at+'Z').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>`;
    }).join('');
    chat.scrollTop = chat.scrollHeight;
  } catch(e) { console.error(e); }
}

let pendingFiles = [];

function autoResizeInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function updateSendBtn() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  if (!input || !btn) return;
  const hasContent = input.value.trim().length > 0 || pendingFiles.length > 0;
  btn.classList.toggle('disabled', !hasContent);
}

function handleFileSelect(input) {
  const files = Array.from(input.files);
  pendingFiles.push(...files);
  renderFilePreviews();
  updateSendBtn();
  input.value = '';
}

function renderFilePreviews() {
  const bar = document.getElementById('chat-preview-bar');
  if (!bar) return;
  if (!pendingFiles.length) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  bar.innerHTML = pendingFiles.map((f, i) => {
    const isImg = f.type.startsWith('image/');
    const thumb = isImg ? `<img src="${URL.createObjectURL(f)}" alt="">` : '';
    const icon = f.type.startsWith('video/') ? '🎬' : f.type.startsWith('audio/') ? '🎵' : '📎';
    return `<div class="chat-preview-item">
      ${isImg ? thumb : `<span>${icon}</span>`}
      <span>${f.name.length > 15 ? f.name.slice(0,12)+'...' : f.name}</span>
      <span class="chat-preview-remove" onclick="removeFile(${i})">&times;</span>
    </div>`;
  }).join('');
}

function removeFile(i) {
  pendingFiles.splice(i, 1);
  renderFilePreviews();
  updateSendBtn();
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  const text = input.value.trim();
  if((!text && !pendingFiles.length) || !currentLeadId) return;

  input.disabled = true;
  btn.classList.add('disabled');

  try {
    // Send attachments first
    for (const file of pendingFiles) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('caption', '');
      await fetch(`/api/leads/${currentLeadId}/attachment`, { method: 'POST', body: fd });
    }
    pendingFiles = [];
    renderFilePreviews();

    // Send text message
    if (text) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`/api/leads/${currentLeadId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });
      clearTimeout(timeout);
    }

    input.value = '';
    autoResizeInput(input);
    loadChatMessages(currentLeadId);
  } catch(e) {
    if (e.name === 'AbortError') {
      alert('Таймаут отправки. Попробуйте ещё раз.');
    }
    console.error(e);
  }
  input.disabled = false;
  updateSendBtn();
  input.focus();
}

function esc(s) { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

function timeAgo(ds) {
  const ms = Date.now() - new Date(ds+'Z').getTime();
  const m = Math.floor(ms/60000);
  if(m<1) return 'только что';
  if(m<60) return m+' мин назад';
  const h = Math.floor(m/60);
  if(h<24) return h+' ч назад';
  return Math.floor(h/24)+' дн назад';
}

document.getElementById('modal-overlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
loadLeads();
setInterval(loadLeads, 10000);
