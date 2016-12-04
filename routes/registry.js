const HttpProxy = require('http-proxy').createProxyServer
const express = require('express')

// const sse = require('../lib/events')

const REGISTRY_HOST = process.env.REGISTRY_HOST || 'localhost'
const REGISTRY_PORT = process.env.REGISTRY_PORT || 5000

const proxy = new HttpProxy()
const router = express.Router()

router.use((req, res, next) => {
  console.log('[%s]: %s %s', new Date(), req.method, req.url)
  next()
})

router.use((req, res, next) => {
  req.url = req.url.replace('/registry', '')
  next()
})

router.all('/*', (req, res) => {
  proxy.web(req, res, {
    target: `http://${REGISTRY_HOST}:${REGISTRY_PORT}/v2`
  })
})

module.exports = router
