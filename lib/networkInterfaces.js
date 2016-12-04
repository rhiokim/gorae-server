const os = require('os')
const networkInterfaces = {}

module.exports = () => {
  let list = os.networkInterfaces()
  Object.keys(list)
    .map(key => {
      const interfaces = list[key].filter(net => {
        return net.family === 'IPv4'
      })

      if (interfaces.length > 0) {
        networkInterfaces[key] = interfaces[0]
      }
    })

  return networkInterfaces
}
