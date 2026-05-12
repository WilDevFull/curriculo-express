const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');


router.get('/', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM hard_skills WHERE candidato_id = $1 ORDER BY id', [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.post('/', async (req, res) => {
    const { id } = req.params;
    const { curso_habilidade, instituicao, carga_horaria, data_conclusao } = req.body;

    if (!curso_habilidade) {
        return res.status(400).json({ erro: 'O campo "curso_habilidade" é obrigatório' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO hard_skills
             (candidato_id, curso_habilidade, instituicao, carga_horaria, data_conclusao)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id, curso_habilidade, instituicao, carga_horaria, data_conclusao]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


router.put('/:skillId', async (req, res) => {
    const { skillId } = req.params;
    const { curso_habilidade, instituicao, carga_horaria, data_conclusao } = req.body;

    if (!curso_habilidade) {
        return res.status(400).json({ erro: 'O campo "curso_habilidade" é obrigatório' });
    }

    try {
        const result = await pool.query(
            `UPDATE hard_skills
             SET curso_habilidade = $1, instituicao = $2,
                 carga_horaria = $3, data_conclusao = $4
             WHERE id = $5 RETURNING *`,
            [curso_habilidade, instituicao, carga_horaria, data_conclusao, skillId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Hard skill não encontrada' });
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
            'DELETE FROM hard_skills WHERE id = $1 RETURNING *', [skillId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Hard skill não encontrada' });
        }

        res.json({ mensagem: 'Hard skill removida com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
