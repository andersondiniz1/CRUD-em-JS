// server.js - node server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configuração da conexão MySQL
const db = mysql.createConnection({
  host: 'localhost', //Mysql@localhost:3306
  user: 'root',
  password: 'Menezeslira10.',
  database: 'itemtable',
  //socketPath: '/var/run/mysqld/mysqld.sock',
  //port: 3306,
});

// -- create_database.sql

// -- Cria o banco de dados
// CREATE DATABASE IF NOT EXISTS `itemtable`;

// -- Usa o banco de dados
// USE `itemtable`;

// -- Cria a tabela 'items'
// CREATE TABLE IF NOT EXISTS `items` (
//   `id` INT AUTO_INCREMENT PRIMARY KEY,
//   `name` VARCHAR(255) NOT NULL,
//   `description` TEXT
// );

// INSERT INTO `items` (`name`, `description`) VALUES
//   ('Item 1', 'Descrição do Item 1'),
//   ('Item 2', 'Descrição do Item 2'),
//   ('Item 3', 'Descrição do Item 3');

// select * from items;


// Conectar ao MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Rota para obter todos os itens do banco de dados
app.get('/api/items', (req, res) => {
  // Consultar todos os itens no banco de dados
  db.query('SELECT * FROM items', (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao obter itens do banco de dados' });
    } else {
      res.json(result);
    }
  });
});

// Rota para obter um item por ID
app.get('/api/items/:id', (req, res) => {
  const itemId = req.params.id;

  // Consultar o item no banco de dados pelo ID
  db.query('SELECT * FROM items WHERE id = ?', [itemId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao obter item do banco de dados' });
    } else {
      const item = result[0]; // Assumindo que o ID é único
      res.render('item', { item });
    }
  });
});

// Rota para adicionar um novo item ao banco de dados
app.post('/api/items', (req, res) => {
  const newItem = req.body;

  // Inserir novo item no banco de dados
  db.query('INSERT INTO items SET ?', [newItem], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao adicionar novo item ao banco de dados' });
    } else {
      // Retornar o novo item com o ID atribuído pelo banco de dados
      const newItemWithId = { ...newItem, id: result.insertId };
      res.status(201).json(newItemWithId);
    }
  });
});

// Rota para atualizar um item por ID
app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;

  // Atualizar o item no banco de dados pelo ID
  db.query('UPDATE items SET ? WHERE id = ?', [updatedItem, itemId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao atualizar item no banco de dados' });
    } else {
      res.json(updatedItem);
    }
  });
});

// Rota para excluir um item por ID
app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;

  // Excluir o item do banco de dados pelo ID
  db.query('DELETE FROM items WHERE id = ?', [itemId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao excluir item do banco de dados' });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  });
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});