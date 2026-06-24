const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err);
    } else {
        console.log('Conectado ao SQLite');
    }
});

// Criar tabelas se não existirem
async function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Tabela de barbeiros
            db.run(`
                CREATE TABLE IF NOT EXISTS barbers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    whatsapp TEXT NOT NULL,
                    instagram TEXT,
                    instagram_handle TEXT,
                    photo TEXT,
                    google_token TEXT,
                    google_refresh_token TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela barbers:', err);
                    reject(err);
                }
            });

            // Tabela de agendamentos
            db.run(`
                CREATE TABLE IF NOT EXISTS bookings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    barber_id INTEGER REFERENCES barbers(id),
                    client_name TEXT NOT NULL,
                    client_phone TEXT NOT NULL,
                    service TEXT NOT NULL,
                    price REAL,
                    booking_date TEXT NOT NULL,
                    booking_time TEXT NOT NULL,
                    calendar_event_id TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela bookings:', err);
                    reject(err);
                } else {
                    console.log('Banco de dados inicializado com sucesso');
                    resolve();
                }
            });
        });
    });
}

module.exports = { db, initDatabase };
