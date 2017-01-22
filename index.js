const express = require('express')
const cors = require('cors')
const http = require('http')
const path = require('path')
const displayRoutes = require('express-routemap')

const pkg = require('./package.json')
const utils = require('./routes/utils')
const docker = require('./routes/docker')
const gorae = require('./routes/gorae')
const socketServer = require('./lib/socketServer')

const port = process.env.PORT || 8082

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'terminal')))
app.use(express.static(path.join(__dirname, '..', 'www')))

app.get('/', (req, res) => {
  res.send(`gorae server v${pkg.version}`)
})

app.use('/utils', utils)
app.use('/api', docker)
app.use('/gorae', gorae)

const httpServer = http.createServer(app).listen(port, () => {
  displayRoutes(app)

  console.log('start server localhost: %s', port)
})
socketServer(httpServer)
