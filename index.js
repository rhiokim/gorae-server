const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

const utils = require('./routes/utils');
const docker = require('./routes/docker');
const socketServer = require('./lib/socketServer');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'terminal')));
app.use(express.static(path.join(__dirname, '..', 'www')));

app.use('/utils', utils);
app.use('/api', docker);

const httpServer = http.createServer(app).listen(process.env.PORT || 8082);
socketServer(httpServer);
