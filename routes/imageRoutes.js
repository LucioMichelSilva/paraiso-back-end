const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/Image');
const Service = require('../models/Service');
const Client = require('../models/Client');
const { Op } = require('sequelize');

// Configuração do multer para lidar com o upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para fazer upload de uma nova imagem
router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { clientId, serviceId } = req.body; // Extrai os campos clientId e serviceId do corpo da requisição

      console.log(clientId, serviceId);

      const image = await Image.create({
        clientId: clientId,
        serviceId: serviceId,
        data: req.file.buffer // Salva os dados binários da imagem no banco de dados
      });
      res.json(image);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Rota para buscar todas as imagens
router.get('/', async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para buscar uma imagem pelo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }
    // Envia os dados binários da imagem como resposta
    res.contentType('image/jpeg'); // Defina o tipo de conteúdo conforme o tipo de imagem
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para atualizar uma imagem pelo ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }
    image.data = req.file.buffer; // Atualiza os dados binários da imagem
    await image.save();
    res.json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para deletar uma imagem pelo ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }
    await image.destroy();
    res.json({ message: 'Imagem deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/grouped/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    // Buscar todas as imagens do cliente especificado, incluindo a descrição do serviço
    const images = await Image.findAll({
      where: { clientId }, // Filtra as imagens pelo clientId
      include: [{
        model: Service,
        attributes: ['name'] // Inclui apenas a descrição do serviço
      }],
      attributes: ['id', 'data', 'createdAt', 'serviceId'],
      order: [['createdAt', 'DESC']],
    });

    // Agora precisamos agrupar as imagens manualmente por serviço e createdAt
    let groupedPhotos = images.reduce((acc, image) => {
      const { serviceId, createdAt } = image;
      const serviceName = image.Service.name;
      const date = createdAt.toISOString().split('T')[0]; // Formata a data para YYYY-MM-DD

      const key = `${serviceId}_${date}`;
      if (!acc[key]) {
        acc[key] = { serviceId, serviceName, createdAt: date, photos: [] };
      }
      acc[key].photos.push({ id: image.id, photoBuffer: image.data.toString('base64') }); // Convertendo buffer para string base64
      return acc;
    }, {});

    // Transformar o objeto em um array no formato desejado
    let result = Object.values(groupedPhotos);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
