import { getCachedMarketData } from '../services/scraperService.js';

export const getAllData = async (req, res) => {
    const cachedData = getCachedMarketData();
    res.json({ success: true, ...cachedData });
};

export const getFiatAndGold = async (req, res) => {
    const { currencies, goldAndCoins, lastUpdated } = getCachedMarketData();
    res.json({ success: true, data: { currencies, goldAndCoins }, lastUpdated });
};

// New Controller Method for Country Currency
export const getMoneyOnly = async (req, res) => {
    const { currencies, lastUpdated } = getCachedMarketData();
    res.json({ success: true, data: { currencies }, lastUpdated });
};

export const getGoldOnly = async (req, res) => {
    const { goldAndCoins, lastUpdated } = getCachedMarketData();
    res.json({ success: true, data: { goldAndCoins }, lastUpdated });
};

export const getCryptoOnly = async (req, res) => {
    const { crypto, lastUpdated } = getCachedMarketData();
    res.json({ success: true, data: { crypto }, lastUpdated });
};

export const searchMarket = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ success: false, message: 'Please provide a search query parameter (q)' });
    }

    const cachedData = getCachedMarketData();
    const searchResults = [];
    const queryLower = q.toLowerCase();

    // 1. Check Currencies / Money
    cachedData.currencies.forEach(item => {
        if (item.name.toLowerCase().includes(queryLower)) {
            searchResults.push({ ...item, type: 'money/fiat' });
        }
    });

    // 2. Check Gold & Coins
    cachedData.goldAndCoins.forEach(item => {
        if (item.name.toLowerCase().includes(queryLower)) {
            searchResults.push({ ...item, type: 'gold/coin' });
        }
    });

    // 3. Check Crypto
    cachedData.crypto.forEach(item => {
        if (item.name.toLowerCase().includes(queryLower)) {
            searchResults.push({ ...item, type: 'crypto' });
        }
    });

    res.json({ 
        success: true, 
        query: q, 
        count: searchResults.length, 
        results: searchResults,
        lastUpdated: cachedData.lastUpdated 
    });
};