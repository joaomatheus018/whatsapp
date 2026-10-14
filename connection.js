const mysql = require('mysql2/promise');

const conn = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    database: 'whatsapp'
});

async function testarBanco() {
    try {
        const [banco] = await conn.query(
            'SELECT DATABASE() AS banco'
        );

        console.log('🗄️ Banco conectado:', banco[0].banco);

        const [tabelas] = await conn.query(
            'SHOW TABLES'
        );

        console.log('📋 Tabelas encontradas:');
        console.table(tabelas);

        const [usuarios] = await conn.query(
            'SELECT id, apelido, telefone FROM ultilizadores'
        );

        console.log(`👥 Usuários encontrados: ${usuarios.length}`);

    } catch (error) {
        console.error('❌ ERRO AO CONECTAR AO MYSQL:');
        console.error(error);
    }
}

testarBanco();

module.exports = conn;