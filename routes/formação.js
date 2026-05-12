const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');


router.get('/', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM formacao_academica WHERE candidato_id = $1 ORDER BY id', [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.post('/', async (req, res) => {
    const { id } = req.params;
    const { curso, instituicao, periodo } = req.body;

    if (!curso) {
        return res.status(400).json({ erro: 'O campo "curso" é obrigatório' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO formacao_academica (candidato_id, curso, instituicao, periodo)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id, curso, instituicao, periodo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.put('/:formacaoId', async (req, res) => {
    const { formacaoId } = req.params;
    const { curso, instituicao, periodo } = req.body;

    if (!curso) {
        return res.status(400).json({ erro: 'O campo "curso" é obrigatório' });
    }

    try {
        const result = await pool.query(
            `UPDATE formacao_academica
             SET curso = $1, instituicao = $2, periodo = $3
             WHERE id = $4 RETURNING *`,
            [curso, instituicao, periodo, formacaoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Formação não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.delete('/:formacaoId', async (req, res) => {
    const { formacaoId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM formacao_academica WHERE id = $1 RETURNING *', [formacaoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Formação não encontrada' });
        }

        res.json({ mensagem: 'Formação acadêmica removida com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
