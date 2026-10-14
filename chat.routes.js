const { Router } = require('express');
const conn = require('../db/connection');

const router = Router();

// ==========================================
// LISTAR USUÁRIOS
// ==========================================
router.get('/usuarios/:telefone', async (req, res) => {
    try {
        const { telefone } = req.params;

        const [usuarios] = await conn.query(
            `SELECT id, apelido, telefone
             FROM ultilizadores
             WHERE telefone <> ?
             ORDER BY apelido ASC`,
            [telefone]
        );

        console.log('👥 Usuários encontrados:', usuarios.length);

        res.json(usuarios);

    } catch (error) {
        console.error('❌ ERRO AO LISTAR USUÁRIOS:', error);

        res.status(500).json({
            error: error.message
        });
    }
});


// ==========================================
// BUSCAR MENSAGENS
// ==========================================
router.get('/mensagens/:remetente/:destinatario', async (req, res) => {

    try {

        const {
            remetente,
            destinatario
        } = req.params;

        const [mensagens] = await conn.query(
            `SELECT *
             FROM mensagem
             WHERE
                (telefone_remetente = ? AND telefone_destinatario = ?)
                OR
                (telefone_remetente = ? AND telefone_destinatario = ?)
             ORDER BY dato_envio ASC`,
            [
                remetente,
                destinatario,
                destinatario,
                remetente
            ]
        );

        res.json(mensagens);

    } catch (error) {

        console.error(
            '❌ ERRO AO BUSCAR MENSAGENS:',
            error
        );

        res.status(500).json({
            error: error.message
        });
    }
});


// ==========================================
// ENVIAR MENSAGEM
// ==========================================
router.post('/mensagens', async (req, res) => {

    try {

        const {
            telefone_remetente,
            telefone_destinatario,
            mensagem
        } = req.body;

        if (
            !telefone_remetente ||
            !telefone_destinatario ||
            !mensagem
        ) {
            return res.status(400).json({
                error: 'Preencha todos os campos.'
            });
        }

        const [resultado] = await conn.query(
            `INSERT INTO mensagem
            (
                telefone_remetente,
                telefone_destinatario,
                mensagem,
                dato_envio
            )
            VALUES (?, ?, ?, NOW())`,
            [
                telefone_remetente,
                telefone_destinatario,
                mensagem
            ]
        );

        console.log(
            `💬 ${telefone_remetente} → ${telefone_destinatario}: ${mensagem}`
        );

        res.json({
            success: true,
            id: resultado.insertId
        });

    } catch (error) {

        console.error(
            '❌ ERRO AO ENVIAR MENSAGEM:',
            error
        );

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;