 const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ Remplace par la bonne IP si besoin (celle de ton serveur Pterodactyl)
const TARGET = 'http://95.111.252.213:19112';

app.use('/', createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Le serveur backend (Pterodactyl) ne répond pas.' });
    }
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Proxy HTTPS actif : redirige vers ${TARGET}`);
});