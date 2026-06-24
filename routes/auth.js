const express = require('express');
const { oauth2Client } = require('../config/google');
const { db } = require('../config/database');

const router = express.Router();

// Endpoint para iniciar autorização OAuth2
router.get('/google', (req, res) => {
    const { barber_id } = req.query;
    const scopes = ['https://www.googleapis.com/auth/calendar.events'];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        state: barber_id // Passar barber_id através do state
    });
    res.redirect(authUrl);
});

// Callback do OAuth2
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    const { state: barber_id } = req.query; // Ler barber_id do state

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Salvar tokens no banco de dados
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE barbers SET google_token = ?, google_refresh_token = ? WHERE id = ?',
                [tokens.access_token, tokens.refresh_token, barber_id],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log(`Token salvo para barbeiro ID: ${barber_id}`);
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('Erro no callback OAuth2:', error);
        res.redirect('/?auth=error');
    }
});

module.exports = router;
