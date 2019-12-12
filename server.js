const express = require('express')

const app = express()

const baseDir = `${__dirname}/build/`

app.use(express.static(`${baseDir}`))

app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))

app.listen(21178, () => console.log(`Servidor subiu com sucesso na porta 21178`))
