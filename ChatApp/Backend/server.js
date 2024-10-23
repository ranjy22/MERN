const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
app.use(cors()); // Permet à toutes les origines d'accéder à votre API
app.use(express.json()); // Pour traiter les données JSON dans les requêtes

// Routes API
app.use('/api/users', userRoutes);  // Pour les routes utilisateur
// app.use('/api/chats', chatRoutes); // Décommenter et ajouter d'autres routes si nécessaire
// app.use('/api/messages', messageRoutes); // Décommenter et ajouter d'autres routes si nécessaire

// Middleware d'erreurs
app.use(notFound);
app.use(errorHandler);

// Créer un serveur HTTP
const server = http.createServer(app);

// Configuration de Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
