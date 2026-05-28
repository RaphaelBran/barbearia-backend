const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Criar agendamento
router.post('/', async (req, res) => {
    const { barber_id, client_name, client_phone, service, price, booking_date, booking_time } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO bookings (barber_id, client_name, client_phone, service, price, booking_date, booking_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [barber_id, client_name, client_phone, service, price, booking_date, booking_time]
        );

        res.json({ success: true, booking: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar agendamento' });
    }
});

// Listar agendamentos de um barbeiro
router.get('/barber/:barber_id', async (req, res) => {
    const { barber_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM bookings WHERE barber_id = $1 ORDER BY booking_date, booking_time',
            [barber_id]
        );

        res.json({ success: true, bookings: result.rows });
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).json({ success: false, error: 'Erro ao listar agendamentos' });
    }
});

// Verificar horários disponíveis para um barbeiro em uma data específica
router.get('/available/:barber_id/:date', async (req, res) => {
    const { barber_id, date } = req.params;

    try {
        const result = await pool.query(
            'SELECT booking_time FROM bookings WHERE barber_id = $1 AND booking_date = $2',
            [barber_id, date]
        );

        // Converter horários de "20:00:00" para "20:00"
        const bookedTimes = result.rows.map(row => {
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
