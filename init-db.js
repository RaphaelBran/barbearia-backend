require('dotenv').config();
const { pool, initDatabase } = require('./config/database');

async function insertBarbers() {
    try {
        await initDatabase();

        // Inserir barbeiros
        const barbers = [
            {
                name: 'Eduardo',
                whatsapp: '5515991932175',
                instagram: 'https://www.instagram.com/de_lara_barber/',
                instagram_handle: '@de_lara_barber',
                photo: 'assets/barber-eduardo.jpg'
            },
            {
                name: 'Caique',
                whatsapp: '5515999999999',
                instagram: 'https://www.instagram.com/caique_de_lara/',
                instagram_handle: '@caique_de_lara',
                photo: 'assets/barber-caique.jpg'
            },
            {
                name: 'Jorge',
                whatsapp: '5515999999999',
                instagram: 'https://www.instagram.com/barbeirogeorge/',
                instagram_handle: '@barbeirogeorge',
                photo: 'assets/barber-jorge.jpg'
            }
        ];

        for (const barber of barbers) {
            await pool.query(
                `INSERT INTO barbers (name, whatsapp, instagram, instagram_handle, photo)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT DO NOTHING`,
                [barber.name, barber.whatsapp, barber.instagram, barber.instagram_handle, barber.photo]
            );
            console.log(`Barbeiro ${barber.name} inserido com sucesso`);
        }

        console.log('Banco de dados inicializado com os barbeiros!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        process.exit(1);
    }
}

insertBarbers();
