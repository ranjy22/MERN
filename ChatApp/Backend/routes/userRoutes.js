const express = require('express');
const User = require('../models/userModels');
const bcrypt = require('bcryptjs'); // Assurez-vous d'importer bcrypt
const { protect, admin } = require('../middleware/authMiddleware'); // Middleware pour protéger les routes

const router = express.Router();

// Route pour enregistrer un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Crée un nouvel utilisateur avec mot de passe haché
    const user = new User({
        username,
        email,
        password 
    });

    try {
        const createdUser = await user.save(); // Sauvegarde qui appellera le hachage
        res.status(201).json(createdUser); // Retourne l'utilisateur créé
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour connecter un utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Authentification réussie, générer un token ou effectuer d'autres actions
    res.json({ message: 'Login successful', user });
});

// Route pour créer un utilisateur (admin)
router.post('/create-user', protect, admin, async (req, res) => {
    const { username, password, email } = req.body;

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe avec un coût de 10

    const user = new User({
        username,
        email,
        password: hashedPassword, 
        isAdmin: false, // Utilisateur non administrateur par défaut
    });

    try {
        const createdUser = await user.save();
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour obtenir tous les utilisateurs (admin)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour mettre à jour un utilisateur (admin)
router.put('/:id', protect, admin, async (req, res) => {
    const { username, email, isAdmin } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin; // Met à jour le rôle d'admin

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour supprimer un utilisateur (admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
