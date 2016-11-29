const httpProxy = require('http-proxy');
const express = require('express');

const keygen = require('./registry/ssh-keygen');
const sse = require('../lib/events');

const REGISTRY_HOST = process.env.REGISTRY_HOST || 'localhost';
const REGISTRY_PORT = process.env.REGISTRY_PORT || 5000;

const proxy = new httpProxy.createProxyServer();
const router = express.Router();

router.use((req, res, next) => {
  console.log('[%s]: %s %s', new Date(), req.method, req.url);
  next();
});

router.use((req, res, next) => {
  req.url = req.url.replace('/registry', '');
  next();
});

router.get('/ssh-keygen', (req, res) => {
  keygen(req.query.author, '')
    .then(out => {
      res.json({pubKey: out.pubKey});
    })
});

router.all('/*', (req, res) => {
  proxy.web(req, res, {
    target: `http://${REGISTRY_HOST}:${REGISTRY_PORT}/v2`
  });
});

module.exports = router;
