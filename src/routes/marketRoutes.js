import express from 'express';
import { getAllData, getFiatAndGold, getMoneyOnly, getGoldOnly, getCryptoOnly, searchMarket } from '../controllers/marketController.js';

const router = express.Router();

router.get('/all', getAllData);
router.get('/fiat-gold', getFiatAndGold);
router.get('/money-only', getMoneyOnly); // <-- New Route
router.get('/gold-only', getGoldOnly);
router.get('/crypto', getCryptoOnly);
router.get('/search', searchMarket);

export default router;