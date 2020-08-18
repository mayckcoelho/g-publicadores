var http = require('http');
const express = require('express');
const app = express();

const baseDir = `${__dirname}/build/`
app.use(express.static(`${baseDir}`))
app.get('/', (req, res) => res.sendfile('index.html', { root: baseDir }))

const port = 21133;
app.listen(port)