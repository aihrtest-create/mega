import express from 'express';
import { statements } from '../database.js';

const router = express.Router();

// POST /api/rsvps
// Create a new RSVP response from a guest
router.post('/', (req, res) => {
  try {
    const { event_id, guest_name, kids_count, adults_count, status } = req.body;
    
    if (!event_id || !guest_name || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const info = statements.createRsvp.run(
      event_id,
      guest_name,
      kids_count || 0,
      adults_count || 0,
      status
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rsvps/:event_id
// Get all RSVP responses for a specific event
router.get('/:event_id', (req, res) => {
  try {
    const event_id = req.params.event_id;
    const rsvps = statements.getRsvpsByEvent.all(event_id);
    
    res.json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rsvps/:event_id/stats
// Get statistics for a specific event
router.get('/:event_id/stats', (req, res) => {
  try {
    const event_id = req.params.event_id;
    const stats = statements.getRsvpStatsByEvent.get(event_id);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching RSVP stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
