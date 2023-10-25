const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

// Configuração do servidor Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'localhost', // O endereço do seu banco de dados MySQL
  user: 'root', // Seu nome de usuário do MySQL
  database: 'escritorio', // Nome do banco de dados
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para lidar com a solicitação do formulário
app.post('/gerarRelatorio', (req, res) => {
  const advogadoId = req.body.advogadoId; // Obtém o ID do advogado do formulário

  // Consulta SQL para listar os processos do advogado com base no ID
  const sql = 'SELECT * FROM processos WHERE advogado_id = ?';

  connection.query(sql, [advogadoId], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      return res.status(500).send('Erro ao buscar os processos.');
    }

    // Renderiza a lista de processos na página
    let html = '<h2>Processos do Advogado</h2>';
    if (results.length === 0) {
      html += '<p>Nenhum processo encontrado para este advogado.</p>';
    } else {
      html += '<ul>';
      results.forEach((processo) => {
        html += `<li>${processo.numero_processo}</li>`;
      });
      html += '</ul>';
    }

    res.send(html);
  });
});

// Inicia o servidor na porta 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});