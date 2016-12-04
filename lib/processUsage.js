const os = require('os')

module.exports = () => ({
  cpus: os.cpus(),
  memory: {
    total: os.totalmem(),
    free: os.freemem(),
    used: os.totalmem() - os.freemem()
  },
  gorae: {
    cpu: process.cpuUsage(),
    memory: process.memoryUsage()
  }
})
