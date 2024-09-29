const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig'); 
const productRoutes = require('./products');

const app = express();
const PORT = 3000;

 
app.use(cors());
app.use(bodyParser.json());

 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

 
app.use('/api/products', productRoutes);

 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
