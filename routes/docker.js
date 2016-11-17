const httpProxy = require('http-proxy');
const express = require('express');

const proxyTarget = require('../lib/proxyTarget');
const sse = require('../lib/events');

// process.env['DOCKER_HOST'] = 'tcp://192.168.99.116:2376';
// const dockerHost = process.env['DOCKER_HOST'];
// const sock = process.env.DOCKER_SOCK || '/var/run/docker.sock';

const proxy = new httpProxy.createProxyServer();
// const proxyTarget = dockerHost
//   ? { target: dockerHost.replace('tcp', 'http') }
//   : { target: { socketPath: sock } };
const router = express.Router();

router.use((req, res, next) => {
  console.log('[%s]: %s %s', new Date(), req.method, req.url);
  next();
});

router.use((req, res, next) => {
  req.url = req.url.replace('/api', '');
  next();
});

router.use((req, res, next) => {
  if (req.url === '/events' && !req.query.since && !req.query.until) {
    sse(req, res);
    return;
  }

  next();
});

router.all('/*', (req, res) => {
  proxy.web(req, res, proxyTarget);
});

module.exports = router;
