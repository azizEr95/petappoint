import { Router } from 'express';
import { addressService } from '../service/addressService';

const router = Router();

router.get('/cities', async (req, res) => {
  try {
    const cities = await addressService.getDistinctCities();
    res.setHeader('Cache-Control', 'max-age=3600');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

export default router;
