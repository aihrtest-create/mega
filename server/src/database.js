import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'leads.db');

// Ensure data directory exists
import fs from 'fs';
fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    messenger TEXT NOT NULL CHECK(messenger IN ('telegram', 'max')),
    status TEXT NOT NULL DEFAULT 'new',
    
    -- Bot integration
    chat_id TEXT,
    bot_username TEXT,
    
    -- Configuration data (JSON)
    config_data TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    bot_connected_at DATETIME,
    link_sent_at DATETIME,
    config_opened_at DATETIME,
    config_submitted_at DATETIME,
    contacted_at DATETIME,
    
    -- Manager notes
    manager_notes TEXT
  );

  CREATE TABLE IF NOT EXISTS lead_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id TEXT NOT NULL REFERENCES leads(id),
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
  CREATE INDEX IF NOT EXISTS idx_events_lead ON lead_events(lead_id);
`);

// Prepared statements for performance
const statements = {
  createLead: db.prepare(`
    INSERT INTO leads (id, name, phone, messenger)
    VALUES (?, ?, ?, ?)
  `),

  getLead: db.prepare(`SELECT * FROM leads WHERE id = ?`),

  getLeadByChat: db.prepare(`
    SELECT * FROM leads WHERE chat_id = ? AND messenger = ?
  `),

  updateLeadStatus: db.prepare(`
    UPDATE leads SET status = ? WHERE id = ?
  `),

  connectBot: db.prepare(`
    UPDATE leads 
    SET chat_id = ?, bot_username = ?, status = 'bot_connected', bot_connected_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  markLinkSent: db.prepare(`
    UPDATE leads SET status = 'link_sent', link_sent_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

  markConfigOpened: db.prepare(`
    UPDATE leads SET status = 'configuring', config_opened_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

  saveConfiguration: db.prepare(`
    UPDATE leads 
    SET config_data = ?, status = 'submitted', config_submitted_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  markContacted: db.prepare(`
    UPDATE leads SET status = 'contacted', contacted_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

  updateNotes: db.prepare(`
    UPDATE leads SET manager_notes = ? WHERE id = ?
  `),

  getAllLeads: db.prepare(`
    SELECT * FROM leads ORDER BY created_at DESC
  `),

  getLeadsByStatus: db.prepare(`
    SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC
  `),

  addEvent: db.prepare(`
    INSERT INTO lead_events (lead_id, event_type, event_data)
    VALUES (?, ?, ?)
  `),

  getLeadEvents: db.prepare(`
    SELECT * FROM lead_events WHERE lead_id = ? ORDER BY created_at DESC
  `),

  getStats: db.prepare(`
    SELECT status, COUNT(*) as count FROM leads GROUP BY status
  `),
};

export { db, statements };
