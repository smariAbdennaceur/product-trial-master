const express = require('express');
const fs = require('fs');
const router = express.Router();

const dataFilePath = './products.json';

// Helper functions to read and write data
const readData = () => {
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

const generateId = () => {
  const products = readData();
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products with pagination, search, and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name or description.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: The field to sort by (e.g., 'price', 'name').
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: The sort order (ascending or descending).
 *     responses:
 *       200:
 *         description: A list of products with pagination, search, and sorting.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get('/', (req, res) => {
  const products = readData();

  // Pagination, search, and sorting options
  const { page = 1, limit = 10, search = '', sort = 'id', order = 'asc' } = req.query;
  
  // Search products by name or description
  let filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(search.toLowerCase()) || 
           product.description.toLowerCase().includes(search.toLowerCase());
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    if (order === 'asc') {
      return a[sort] > b[sort] ? 1 : -1;
    } else {
      return a[sort] < b[sort] ? 1 : -1;
    }
  });

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  res.json({
    products: paginatedProducts,
    totalItems,
    totalPages,
    currentPage: parseInt(page)
  });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully.
 */
router.post('/', (req, res) => {
  const products = readData();
  const newProduct = {
    id: generateId(),
    ...req.body,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  products.push(newProduct);
  writeData(products);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve details for a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Product details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 */
router.get('/:id', (req, res) => {
  const products = readData();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update details of a product if it exists
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 */
router.patch('/:id', (req, res) => {
  const products = readData();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    updatedAt: Date.now(),
  };
  products[productIndex] = updatedProduct;
  writeData(products);
  res.json(updatedProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID.
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 */
router.delete('/:id', (req, res) => {
  const products = readData();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products.splice(productIndex, 1);
  writeData(products);
  res.status(204).send();
});

module.exports = router;
