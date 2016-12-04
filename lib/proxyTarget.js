const dockerHost = process.env['DOCKER_HOST']
const sock = process.env.DOCKER_SOCK || '/var/run/docker.sock'

const proxyTarget = dockerHost
  ? { target: dockerHost.replace('tcp', 'http') }
  : { target: { socketPath: sock } }

module.exports = proxyTarget
