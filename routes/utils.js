const express = require('express')

const pkg = require('../package.json')
const networkInterfaces = require('../lib/networkInterfaces')()

const router = express.Router()

router.get('/', (req, res) => {
  res.send(`Gorae Server v${pkg.version} - Hello World!`)
})

router.get('/networkInterfaces', (req, res) => {
  res.json(networkInterfaces)
})

module.exports = router
