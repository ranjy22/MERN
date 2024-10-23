const User = require('../models/userModels'); // Assurez-vous que le chemin est correct

// Fonction pour enregistrer un utilisateur
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validation des données (ajoutez la validation selon vos besoins)

    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fonction pour connecter un utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validation des données (ajoutez la validation selon vos besoins)

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
