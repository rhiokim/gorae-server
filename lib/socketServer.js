const server = require('socket.io')
const Docker = require('dockerode')

const SocketStream = require('./socketStream')
const sock = process.env.DOCKER_SOCK || '/var/run/docker.sock'
const docker = new Docker({socketPath: sock})

// const expressWs = require('express-ws')(app)
module.exports = httpServer => {
  const sockServer = server(httpServer, { path: '/wetty/socket.io' })

  sockServer.on('connection', socket => {
    console.log('terminal connection')
    // const write = data => socket.emit('output', data)
    let container
    socket.on('container', con => {
      console.log(con)
      container = docker.getContainer(con.id)

      if (con.cmd) {
        container.exec({
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Cmd: [con.cmd],
          DetachKeys: 'ctrl-p,ctrl-q',
          Privileged: true,
          Tty: true
          // User: "123:456"
        }, (err, exec) => {
          if (err) {
            console.log(err)
            return
          }

          exec.start({
            hijack: true,
            stdin: true
          }, (err, ttyStream) => {
            console.log('attach', err, ttyStream)
            ttyStream.pipe(new SocketStream(socket))

            socket.emit('ready', '')

            socket.on('resize', size => {
              console.log('resize:', size)
              container.resize({h: size.row, w: size.col}, () => {
              })
            })

            socket.on('input', data => {
              console.log('socket input:', data)
              ttyStream.write(data)
            })

            container.wait()
          })
        })
      } else {
        container.attach({stream: true, stdin: true, stdout: true, stderr: true},
          (err, ttyStream) => {
            console.log('attach', err, ttyStream)
            ttyStream.pipe(new SocketStream(socket))

            socket.emit('ready', '')

            socket.on('resize', size => {
              console.log('resize:', size)
              container.resize({h: size.row, w: size.col}, () => {
              })
            })

            socket.on('input', data => {
              console.log('socket input:', data)
              ttyStream.write(data)
            })

            container.wait()
          }
        )
      }
    })
  })

  return sockServer
}
