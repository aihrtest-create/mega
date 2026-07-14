import { Router } from 'express';
import { redis } from '../services/redis.js';

const router = Router();

// GET /api/shorten?id=...
router.get('/', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    const data = await redis.get(`invite:${id}`);
    if (!data) {
      return res.status(404).json({ error: 'Short link not found or expired' });
    }

    return res.json(JSON.parse(data));
  } catch (error) {
    console.error('[Shorten API Error]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
