const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nome, email, objetivo FROM candidato ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.get('/:id/curriculo', async (req, res) => {
    try {
        const { id } = req.params;

        const candidato = await pool.query(
            'SELECT * FROM candidato WHERE id = $1', [id]
        );

        if (candidato.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Candidato não encontrado' });
        }

        const [softSkills, formacao, experiencia, hardSkills] = await Promise.all([
            pool.query('SELECT * FROM soft_skills WHERE candidato_id = $1', [id]),
            pool.query('SELECT * FROM formacao_academica WHERE candidato_id = $1', [id]),
            pool.query('SELECT * FROM experiencia_profissional WHERE candidato_id = $1', [id]),
            pool.query('SELECT * FROM hard_skills WHERE candidato_id = $1', [id]),
        ]);

        res.json({
            dados_pessoais:          candidato.rows[0],
            soft_skills:             softSkills.rows,
            formacao_academica:      formacao.rows,
            experiencia_profissional: experiencia.rows,
            hard_skills:             hardSkills.rows,
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.post('/', async (req, res) => {
    const {
        nome, endereco, nacionalidade_estado_civil,
        idade, cnh, linkedin, objetivo,
        telefone1, telefone2, email
    } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO candidato
             (nome, endereco, nacionalidade_estado_civil, idade, cnh,
              linkedin, objetivo, telefone1, telefone2, email)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [nome, endereco, nacionalidade_estado_civil, idade,
             cnh, linkedin, objetivo, telefone1, telefone2, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nome, endereco, nacionalidade_estado_civil,
        idade, cnh, linkedin, objetivo,
        telefone1, telefone2, email
    } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
    }

    try {
        const result = await pool.query(
            `UPDATE candidato SET
               nome = $1, endereco = $2,
               nacionalidade_estado_civil = $3, idade = $4,
               cnh = $5, linkedin = $6, objetivo = $7,
               telefone1 = $8, telefone2 = $9, email = $10
             WHERE id = $11
             RETURNING *`,
            [nome, endereco, nacionalidade_estado_civil, idade,
             cnh, linkedin, objetivo, telefone1, telefone2, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Candidato não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM candidato WHERE id = $1 RETURNING id, nome', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Candidato não encontrado' });
        }

        res.json({
            mensagem: 'Candidato e todos os dados relacionados foram deletados com sucesso',
            candidato_deletado: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
