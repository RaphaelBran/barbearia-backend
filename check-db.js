require('dotenv').config();
const { pool } = require('./config/database');

async function checkDatabase() {
    try {
        // Verificar barbeiros
        const barbers = await pool.query('SELECT id, name, google_token IS NOT NULL as has_token FROM barbers');
        console.log('=== BARBEIROS ===');
        barbers.rows.forEach(barber => {
            console.log(`ID: ${barber.id}, Nome: ${barber.name}, Tem Token Google: ${barber.has_token ? 'SIM' : 'NÃO'}`);
        });

        // Verificar agendamentos
        const bookings = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5');
        console.log('\n=== ÚLTIMOS AGENDAMENTOS ===');
        if (bookings.rows.length === 0) {
            console.log('Nenhum agendamento encontrado');
        } else {
            bookings.rows.forEach(booking => {
                console.log(`ID: ${booking.id}, Cliente: ${booking.client_name}, Serviço: ${booking.service}, Data: ${booking.booking_date}, Hora: ${booking.booking_time}, Evento Calendar: ${booking.calendar_event_id || 'NÃO CRIADO'}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

checkDatabase();
