const express = require('express');
const { calendar, oauth2Client } = require('../config/google');
const { pool } = require('../config/database');

const router = express.Router();

// Criar evento no Google Calendar
router.post('/event', async (req, res) => {
    const { barber_id, client_name, service, booking_date, booking_time } = req.body;

    try {
        // Buscar token do barbeiro
        const barberResult = await pool.query(
            'SELECT google_token, google_refresh_token FROM barbers WHERE id = $1',
            [barber_id]
        );

        if (barberResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Barbeiro não encontrado' });
        }

        const { google_token, google_refresh_token } = barberResult.rows[0];

        if (!google_token) {
            return res.status(400).json({ success: false, error: 'Barbeiro não autorizou Google Calendar' });
        }

        // Configurar OAuth2 com o token do barbeiro
        oauth2Client.setCredentials({
            access_token: google_token,
            refresh_token: google_refresh_token
        });

        // Criar evento no calendário
        const event = {
            summary: `Agendamento: ${service} - ${client_name}`,
            description: `Agendamento de ${service} para ${client_name}`,
            start: {
                dateTime: `${booking_date}T${booking_time}:00-03:00`,
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: `${booking_date}T${booking_time}:30-03:00`,
                timeZone: 'America/Sao_Paulo'
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event
        });

        res.json({ success: true, eventId: response.data.id });
    } catch (error) {
        console.error('Erro ao criar evento no calendário:', error);
        
        // Tentar renovar token se expirou
        if (error.code === 401) {
            try {
                await oauth2Client.refreshAccessToken();
                const newTokens = oauth2Client.credentials;
                
                // Atualizar token no banco
                await pool.query(
                    'UPDATE barbers SET google_token = $1 WHERE id = $2',
                    [newTokens.access_token, barber_id]
                );
                
                // Tentar novamente
                const response = await calendar.events.insert({
                    calendarId: 'primary',
                    resource: event
                });
                
                res.json({ success: true, eventId: response.data.id });
            } catch (refreshError) {
                console.error('Erro ao renovar token:', refreshError);
                res.status(500).json({ success: false, error: 'Erro ao renovar token' });
            }
        } else {
            res.status(500).json({ success: false, error: 'Erro ao criar evento' });
        }
    }
});

module.exports = router;
