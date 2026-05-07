const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Rota 1: Listar dados básicos de todos os candidatos
app.get('/api/candidatos', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome, email, objetivo FROM candidato');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// Rota 2: Obter o currículo completo de um candidato específico pelo ID
app.get('/api/candidatos/:id/curriculo', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Busca os dados principais
        const candidatoRes = await pool.query('SELECT * FROM candidato WHERE id = $1', [id]);
        
        // Se o array voltar vazio, o candidato não existe
        if (candidatoRes.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Candidato não encontrado' });
        }
        
        // Busca os dados das tabelas relacionadas
        const softSkillsRes = await pool.query('SELECT habilidade FROM soft_skills WHERE candidato_id = $1', [id]);
        const formacaoRes = await pool.query('SELECT curso, instituicao, periodo FROM formacao_academica WHERE candidato_id = $1', [id]);
        const expRes = await pool.query('SELECT empresa, cargo, duracao_periodo FROM experiencia_profissional WHERE candidato_id = $1', [id]);
        const hardSkillsRes = await pool.query('SELECT curso_habilidade, instituicao, carga_horaria, data_conclusao FROM hard_skills WHERE candidato_id = $1', [id]);

        // Monta o objeto final no formato JSON estruturado
        const curriculoCompleto = {
            dados_pessoais: candidatoRes.rows[0],
            soft_skills: softSkillsRes.rows,
            formacao_academica: formacaoRes.rows,
            experiencia_profissional: expRes.rows,
            hard_skills: hardSkillsRes.rows
        };

        // Envia a resposta
        res.json(curriculoCompleto);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// Inicializa o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`Testar rota geral: http://localhost:${port}/api/candidatos`);
    console.log(`Testar rota específica: http://localhost:${port}/api/candidatos/1/curriculo`);
});