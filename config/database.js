const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Criar tabelas se não existirem
async function initDatabase() {
    try {
        // Tabela de barbeiros
        await pool.query(`
            CREATE TABLE IF NOT EXISTS barbers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                whatsapp VARCHAR(20) NOT NULL,
                instagram VARCHAR(255),
                instagram_handle VARCHAR(100),
                photo VARCHAR(255),
                google_token TEXT,
                google_refresh_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de agendamentos
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                barber_id INTEGER REFERENCES barbers(id),
                client_name VARCHAR(100) NOT NULL,
                client_phone VARCHAR(20) NOT NULL,
                service VARCHAR(50) NOT NULL,
                price DECIMAL(10,2),
                booking_date DATE NOT NULL,
                booking_time TIME NOT NULL,
                calendar_event_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
    }
}

module.exports = { pool, initDatabase };
