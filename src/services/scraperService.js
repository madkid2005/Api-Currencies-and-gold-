import axios from 'axios';
import * as cheerio from 'cheerio';

let memoryCache = {
    currencies: [],
    goldAndCoins: [],
    crypto: [],
    lastUpdated: null
};

export const getCachedMarketData = () => {
    return memoryCache;
};

export const updateMarketCache = async () => {
    try {
        const url = 'https://www.tgju.org/';
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000 
        });

        const $ = cheerio.load(data);
        
        const currencies = [];
        const goldAndCoins = [];
        const crypto = [];

        $('tr[data-market-row]').each((index, element) => {
            const id = $(element).attr('data-market-row') || '';
            const title = $(element).find('th').text().trim();
            let price = $(element).find('td').first().text().trim();
            const change = $(element).find('.market-change_percent').text().trim();

            if (!title || !price) return;

            if (price.includes('دولتی')) {
                price = price.replace(/.*دولتی\s*/, '').trim();
            }

            const item = { id, name: title, price, change };

            if (id.startsWith('crypto-') || title.includes('تتر') || title.includes('بیت کوین') || title.includes('اتریوم')) {
                crypto.push(item);
            } else if (title.includes('طلا') || title.includes('سکه') || title.includes('مثقال') || id.includes('coin') || id.includes('gerami')) {
                goldAndCoins.push(item);
            } else if (title.includes('دلار') || title.includes('یورو') || title.includes('درهم') || title.includes('پوند') || title.includes('لیر')) {
                currencies.push(item);
            }
        });

        memoryCache = {
            currencies,
            goldAndCoins,
            crypto,
            lastUpdated: new Date().toISOString()
        };

        console.log(`[${new Date().toLocaleTimeString()}] ✅ Memory cache successfully updated.`);
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ Background cache update failed:`, error.message);
    }
};

const REFRESH_INTERVAL = 60 * 1000; 
setInterval(updateMarketCache, REFRESH_INTERVAL);