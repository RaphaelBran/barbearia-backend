require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const calendarRoutes = require('./routes/calendar');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// Routes
app.use('/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/calendar', calendarRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.send('<h1>Autenticação realizada com sucesso! Você já pode fechar esta aba e testar o agendamento.</h1>');
});

// Inicializar banco de dados e iniciar servidor
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao iniciar servidor:', err);
});
