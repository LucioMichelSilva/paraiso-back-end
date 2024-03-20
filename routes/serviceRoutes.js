const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Create Service
router.post('/', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Services
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Service
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Service.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedService = await Service.findOne({ where: { id } });
      return res.json({ service: updatedService });
    }
    throw new Error('Service not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Delete Service
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Service.destroy({
      where: { id }
    });
    if (deleted) {
      return res.json({ message: 'Service deleted' });
    }
    throw new Error('Service not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
