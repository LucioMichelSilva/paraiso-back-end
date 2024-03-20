const express = require('express');
const bodyParser = require('body-parser');
const serviceRoutes = require('./routes/serviceRoutes');
const clientRoutes = require('./routes/clientRoutes');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./database');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const hostname = '0.0.0.0';

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); // Permitir todos os origens
  }
}));

app.use(express.json());
app.use(bodyParser.json());

app.use('/services', serviceRoutes);
app.use('/clients', clientRoutes);
app.use('/images', imageRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Sincronize os modelos com o banco de dados
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Unable to sync database:', err);
});

app.listen(PORT, hostname, () => {
  console.log(`Server is running on port ${PORT}`);
});
