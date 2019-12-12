const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(21178, () => { console.log(`Servidor subiu com sucesso na porta 21178`); console.log(JSON.stringify(process.env)) })
