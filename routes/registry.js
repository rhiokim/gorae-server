const httpProxy = require('http-proxy');
const express = require('express');

const sse = require('../lib/events');

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

router.all('/*', (req, res) => {
  proxy.web(req, res, {
    target: 'http://localhost:5000/v2'
  });
});

module.exports = router;
