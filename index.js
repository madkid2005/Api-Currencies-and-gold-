import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import marketRoutes from './src/routes/marketRoutes.js';
import { updateMarketCache } from './src/services/scraperService.js';

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());

// --- Swagger Configuration ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TGJU Scraper API (RouteX)',
            version: '1.0.0',
            description: 'High-performance API scraping live prices for gold, fiat currencies, and cryptocurrencies from TGJU with internal background caching.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local Server',
            },
        ],
        paths: {
            '/api/market/all': {
                get: {
                    summary: 'Get all market data',
                    description: 'Returns all available data including fiat currencies, gold/coins, and cryptocurrencies along with the last updated timestamp.',
                    responses: { '200': { description: 'Success' } }
                }
            },
            '/api/market/fiat-gold': {
                get: {
                    summary: 'Get fiat currencies and gold data',
                    description: 'Returns a filtered list containing only international fiat currencies and gold/coin prices, excluding crypto.',
                    responses: { '200': { description: 'Success' } }
                }
            },
            '/api/market/money-only': {
                get: {
                    summary: 'Get fiat country currencies only',
                    description: 'Returns a filtered list containing only global country currencies (e.g., USD, EUR, AED, TRY).',
                    responses: { '200': { description: 'Success' } }
                }
            },
            '/api/market/gold-only': {
                get: {
                    summary: 'Get gold and coins data only',
                    description: 'Returns a filtered list containing only gold items, bullion, miligrams, and classic coins.',
                    responses: { '200': { description: 'Success' } }
                }
            },
            '/api/market/crypto': {
                get: {
                    summary: 'Get cryptocurrency data only',
                    description: 'Returns a filtered list containing only cryptocurrencies and their live prices.',
                    responses: { '200': { description: 'Success' } }
                }
            },
            '/api/market/search': {
                get: {
                    summary: 'Smart search across all categories',
                    description: 'Searches across all asset categories (Crypto, Gold, Money) based on the asset name or keyword.',
                    parameters: [
                        {
                            name: 'q',
                            in: 'query',
                            required: true,
                            description: 'The search keyword (e.g., "تتر", "دلار", "سکه")',
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        '200': { description: 'Success' },
                        '400': { description: 'Search query parameter (q) is missing' }
                    }
                }
            }
        }
    },
    apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/market', marketRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, async () => {
    console.log(`🚀 API Server is running on: http://localhost:${PORT}`);
    console.log(`📝 Swagger Documentation available at: http://localhost:${PORT}/api-docs`);
    console.log('⏳ Fetching initial market data...');
    await updateMarketCache();
});