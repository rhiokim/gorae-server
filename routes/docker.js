const httpProxy = require('http-proxy');
const Docker = require('dockerode');
const express = require('express');

const sse = require('../lib/events');

const sock = process.env.DOCKER_SOCK || '/var/run/docker.sock';
const docker = new Docker({socketPath: sock});
const proxy = new httpProxy.createProxyServer();
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
  if (req.url === '/events') {
    sse(req, res);
    return;
  }

  next();
});

router.all('/*', (req, res) => {
  console.log('router.all')
  proxy.web(req, res, {
    target: {
      socketPath: sock
    }
  });
});

module.exports = router;
