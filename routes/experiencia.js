const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');


router.get('/', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM experiencia_profissional WHERE candidato_id = $1 ORDER BY id', [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.post('/', async (req, res) => {
    const { id } = req.params;
    const { empresa, cargo, duracao_periodo } = req.body;

    if (!empresa || !cargo) {
        return res.status(400).json({ erro: 'Os campos "empresa" e "cargo" são obrigatórios' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO experiencia_profissional (candidato_id, empresa, cargo, duracao_periodo)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id, empresa, cargo, duracao_periodo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.put('/:expId', async (req, res) => {
    const { expId } = req.params;
    const { empresa, cargo, duracao_periodo } = req.body;

    if (!empresa || !cargo) {
        return res.status(400).json({ erro: 'Os campos "empresa" e "cargo" são obrigatórios' });
    }

    try {
        const result = await pool.query(
            `UPDATE experiencia_profissional
             SET empresa = $1, cargo = $2, duracao_periodo = $3
             WHERE id = $4 RETURNING *`,
            [empresa, cargo, duracao_periodo, expId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Experiência não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.delete('/:expId', async (req, res) => {
    const { expId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM experiencia_profissional WHERE id = $1 RETURNING *', [expId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Experiência não encontrada' });
        }

        res.json({ mensagem: 'Experiência profissional removida com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
