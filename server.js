require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const calendarRoutes = require('./routes/calendar');

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
    res.sendFile(__dirname + '/../index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
