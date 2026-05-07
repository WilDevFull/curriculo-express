const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Obrigatório para conectar ao NeonDB
    }
});

module.exports = pool;