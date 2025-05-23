const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    throw err;
  } else {
    console.log('Conectado ao banco de dados SQLite.');

    db.run("CREATE TABLE IF NOT EXISTS products (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "name TEXT," +
      "retail_price REAL," +
      "wholesale_price REAL," +
      "quantity INTEGER" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS sales (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "product_id INTEGER," +
      "quantity INTEGER," +
      "sale_date TEXT DEFAULT (datetime('now'))," +
      "FOREIGN KEY(product_id) REFERENCES products(id)" +
    ")");
  }
});

module.exports = db;
