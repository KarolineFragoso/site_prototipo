const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser());

app.get('/', (req, res) => {
  res.json({ message: 'Backend do site-prototipo está rodando.' });
});

// Validation function for product data
function validateProduct(data) {
  const errors = [];
  if (!data.name || data.name.trim() === '') {
    errors.push('O nome do produto é obrigatório.');
  }
  if (typeof data.retail_price !== 'number' || data.retail_price < 0) {
    errors.push('O preço de varejo deve ser um número maior ou igual a zero.');
  }
  if (typeof data.wholesale_price !== 'number' || data.wholesale_price < 0) {
    errors.push('O preço de atacado deve ser um número maior ou igual a zero.');
  }
  if (!Number.isInteger(data.quantity) || data.quantity < 0) {
    errors.push('A quantidade deve ser um número inteiro maior ou igual a zero.');
  }
  return errors;
}

// Routes for products
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    res.json(row);
  });
});

app.post('/products', (req, res) => {
  const errors = validateProduct(req.body);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const { name, retail_price, wholesale_price, quantity } = req.body;
  const sql = 'INSERT INTO products (name, retail_price, wholesale_price, quantity) VALUES (?, ?, ?, ?)';
  const params = [name, retail_price, wholesale_price, quantity];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, retail_price, wholesale_price, quantity });
  });
});

app.put('/products/:id', (req, res) => {
  const errors = validateProduct(req.body);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const { name, retail_price, wholesale_price, quantity } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE products SET name = ?, retail_price = ?, wholesale_price = ?, quantity = ? WHERE id = ?';
  const params = [name, retail_price, wholesale_price, quantity, id];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id, name, retail_price, wholesale_price, quantity });
  });
});

// Routes for sales
app.get('/sales', (req, res) => {
  const sql = `
    SELECT 
      sales.id,
      products.name as product,
      sales.quantity,
      (sales.quantity * products.retail_price) as total_price,
      sales.sale_date as date
    FROM sales
    JOIN products ON sales.product_id = products.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint para deletar produto por id
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    res.json({ message: `Produto com id ${id} deletado com sucesso` });
  });
});

app.post('/sales', (req, res) => {
  const { product_id, quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    res.status(400).json({ error: 'Quantidade inválida' });
    return;
  }

  // Check current stock
  const checkStockSql = 'SELECT quantity FROM products WHERE id = ?';
  db.get(checkStockSql, [product_id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    if (row.quantity < quantity) {
      res.status(400).json({ error: 'Estoque insuficiente' });
      return;
    }

    // Insert sale
    const insertSaleSql = 'INSERT INTO sales (product_id, quantity) VALUES (?, ?)';
    db.run(insertSaleSql, [product_id, quantity], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      // Update product stock
      const updateStockSql = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
      db.run(updateStockSql, [quantity, product_id], function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID, product_id, quantity });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});

// Endpoint para deletar produtos com dados inválidos
app.delete('/products/cleanup-invalid', (req, res) => {
  const sql = "DELETE FROM products WHERE name = '' OR retail_price < 0 OR wholesale_price < 0 OR quantity < 0";
  db.run(sql, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Falha ao deletar produtos inválidos' });
    }
    res.json({ message: `Deletados ${this.changes} produtos inválidos` });
  });
});
