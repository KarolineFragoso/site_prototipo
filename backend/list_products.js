const db = require('./database');

const sql = 'SELECT * FROM products';

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error('Erro ao buscar produtos:', err.message);
    process.exit(1);
  }
  if (rows.length === 0) {
    console.log('Nenhum produto encontrado no banco de dados.');
  } else {
    console.log('Produtos encontrados:');
    rows.forEach((row) => {
      console.log(row);
    });
  }
  process.exit(0);
});
