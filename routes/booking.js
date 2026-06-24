const express = require('express');
const { db } = require('../config/database');

const router = express.Router();

// Criar agendamento
router.post('/', async (req, res) => {
    const { barber_id, client_name, client_phone, service, price, booking_date, booking_time } = req.body;

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO bookings (barber_id, client_name, client_phone, service, price, booking_date, booking_time)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [barber_id, client_name, client_phone, service, price, booking_date, booking_time],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });

        res.json({ success: true, booking: { id: result.id, barber_id, client_name, client_phone, service, price, booking_date, booking_time } });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar agendamento' });
    }
});

// Listar agendamentos de um barbeiro
router.get('/barber/:barber_id', async (req, res) => {
    const { barber_id } = req.params;

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM bookings WHERE barber_id = ? ORDER BY booking_date, booking_time',
                [barber_id],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        res.json({ success: true, bookings: rows });
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).json({ success: false, error: 'Erro ao listar agendamentos' });
    }
});

// Verificar horários disponíveis para um barbeiro em uma data específica
router.get('/available/:barber_id/:date', async (req, res) => {
    const { barber_id, date } = req.params;

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(
                'SELECT booking_time FROM bookings WHERE barber_id = ? AND booking_date = ?',
                [barber_id, date],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // Converter horários de "20:00:00" para "20:00"
        const bookedTimes = rows.map(row => {
            const time = row.booking_time;
            return time.substring(0, 5); // Pega apenas "HH:MM"
        });
        res.json({ success: true, bookedTimes });
    } catch (error) {
        console.error('Erro ao verificar horários disponíveis:', error);
        res.status(500).json({ success: false, error: 'Erro ao verificar horários disponíveis' });
    }
});

module.exports = router;
