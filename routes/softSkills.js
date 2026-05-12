const express = require('express');
// mergeParams: true permite receber o :id do candidato vindo da rota pai
const router = express.Router({ mergeParams: true });
const pool = require('../db');


router.get('/', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM soft_skills WHERE candidato_id = $1 ORDER BY id', [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.post('/', async (req, res) => {
    const { id } = req.params;
    const { habilidade } = req.body;

    if (!habilidade) {
        return res.status(400).json({ erro: 'O campo "habilidade" é obrigatório' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO soft_skills (candidato_id, habilidade) VALUES ($1, $2) RETURNING *',
            [id, habilidade]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.put('/:skillId', async (req, res) => {
    const { skillId } = req.params;
    const { habilidade } = req.body;

    if (!habilidade) {
        return res.status(400).json({ erro: 'O campo "habilidade" é obrigatório' });
    }

    try {
        const result = await pool.query(
            'UPDATE soft_skills SET habilidade = $1 WHERE id = $2 RETURNING *',
            [habilidade, skillId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Soft skill não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.delete('/:skillId', async (req, res) => {
    const { skillId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM soft_skills WHERE id = $1 RETURNING *', [skillId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Soft skill não encontrada' });
        }

        res.json({ mensagem: 'Soft skill removida com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
