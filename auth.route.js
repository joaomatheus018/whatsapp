const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/auth', async (req, res) => {
    try {
        const { telefone, senha } = req.body;

        console.log('📥 Login:', telefone);

        if (!telefone || !senha) {
            return res.status(400).json({
                isAuth: false,
                mensagem: 'Preencha telefone e senha.'
            });
        }

        const sql = `
            SELECT *
            FROM ultilizadores
            WHERE telefone = ? AND senha = ?
            LIMIT 1
        `;

        const [results] = await db.query(sql, [telefone, senha]);

        console.log('👤 Usuários encontrados:', results.length);

        if (results.length > 0) {
            return res.json({
                isAuth: true,
                usuario: results[0]
            });
        }

        return res.status(401).json({
            isAuth: false,
            mensagem: 'Telefone ou senha incorretos.'
        });

    } catch (error) {
        console.error('❌ Erro no login:', error);

        return res.status(500).json({
            isAuth: false,
            mensagem: error.message
        });
    }
});

module.exports = router;