const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const server = require('socket.io');
const httpProxy = require('http-proxy');
const Docker = require('dockerode');
const pkg = require('./package.json');

const SocketStream = require('./lib/socketStream');
const sse = require('./lib/events');
const networkInterfaces = require('./lib/networkInterfaces')();

const sock = process.env.DOCKER_SOCK || '/var/run/docker.sock';
const docker = new Docker({socketPath: sock});

const proxy = new httpProxy.createProxyServer();
const app = express();
const expressWs = require('express-ws')(app);
app.use(cors());
// app.use(express.static(path.join(__dirname, 'terminal')));
app.use(express.static(path.join(__dirname, '..', 'www')));

app.get('/', (req, res) => {
  res.send(`Gorae Server v${pkg.version} - Hello World!`);
});

app.get('/networkInterfaces', (req, res) => {
  res.json(networkInterfaces);
});

app.all('/api/*', (req, res) => {
  console.log('[%s]: %s %s', new Date(), req.method, req.url);
  req.url = req.url.replace('/api', '');

  if (req.url === '/events') {
    sse(req, res);
    return;
  }

  proxy.web(req, res, {
    target: {
      socketPath: sock
    }
  });
});

const httpServer = http.createServer(app).listen(process.env.PORT || 8082);

/**
 * @TODO split from inex.js to module
 */
const sockServer = server(httpServer, { path: '/wetty/socket.io' });

sockServer.on('connection', socket => {
  console.log('terminal connection');
  const write = data => socket.emit('output', data);
  let container;
  socket.on('container', con => {
    console.log(con);
    container = docker.getContainer(con.id);
    container.attach({stream: true, stdin: true, stdout: true, stderr: true},
      (err, ttyStream) => {
        ttyStream.pipe(new SocketStream(socket));

        socket.emit('ready', '');

        socket.on('resize', size => {
          console.log('resize:', size);
          container.resize({h: size.row, w: size.col}, () => {
          });
        });

        socket.on('input', data => {
          console.log('socket input:', data);
          ttyStream.write(data);
        });

        container.wait();
    });
  });
});
