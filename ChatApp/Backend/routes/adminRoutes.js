const express = require('express');
const User = require('./models/userModels'); 
const { protect, admin } = require('./middleware/authMiddleware'); // Middleware pour protéger les routes

const router = express.Router();

// Route pour créer un utilisateur
router.post('/create-user', protect, admin, async (req, res) => {
  const { username, password } = req.body;
  
  const user = new User({
    username,
    password, // Pensez à hacher le mot de passe avant de le stocker
    isAdmin: false, // Utilisateur non administrateur par défaut
  });

  try {
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
