const express = require('express');
const cors = require('cors');

const authRoute = require('./routes/auth.route');
const chatRoute = require('./routes/chat.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRoute);
app.use('/', chatRoute);

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando em http://127.0.0.1:${PORT}`);
});