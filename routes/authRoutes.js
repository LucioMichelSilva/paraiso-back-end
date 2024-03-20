// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Procura o usuário no banco de dados
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ userId: user.id }, 'secretpassword', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ message: 'Erro durante o login' });
  }
});

module.exports = router;
