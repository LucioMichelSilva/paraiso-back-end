const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Create Client
router.post('/', async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Client
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Client.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedClient = await Client.findOne({ where: { id } });
      return res.json({ client: updatedClient });
    }
    throw new Error('Client not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Delete Client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Client.destroy({
      where: { id }
    });
    if (deleted) {
      return res.json({ message: 'Client deleted' });
    }
    throw new Error('Client not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;