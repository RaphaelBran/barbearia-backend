const express = require('express');
const { calendar, oauth2Client } = require('../config/google');
const { db } = require('../config/database');

const router = express.Router();

// Criar evento no Google Calendar
router.post('/event', async (req, res) => {
    const { barber_id, client_name, service, booking_date, booking_time } = req.body;

    try {
        // Buscar token do barbeiro
        const barberRow = await new Promise((resolve, reject) => {
            db.get(
                'SELECT google_token, google_refresh_token FROM barbers WHERE id = ?',
                [barber_id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!barberRow) {
            return res.status(404).json({ success: false, error: 'Barbeiro não encontrado' });
        }

        const { google_token, google_refresh_token } = barberRow;

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
                await new Promise((resolve, reject) => {
                    db.run(
                        'UPDATE barbers SET google_token = ? WHERE id = ?',
                        [newTokens.access_token, barber_id],
                        function(err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
                
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
