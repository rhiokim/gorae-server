const server = require('socket.io');
const SocketStream = require('./socketStream');

// const expressWs = require('express-ws')(app);
module.exports = httpServer => {
  const sockServer = server(httpServer, { path: '/wetty/socket.io' });

  sockServer.on('connection', socket => {
    console.log('terminal connection');
    const write = data => socket.emit('output', data);
    let container;
    socket.on('container', con => {
      console.log(con);
      container = docker.getContainer(con.id);
      container.attach({stream: true, stdin: true, stdout: true, stderr: true},
        (err, ttyStream) => {
          ttyStream.pipe(new SocketStream(socket));

          socket.emit('ready', '');

          socket.on('resize', size => {
            console.log('resize:', size);
            container.resize({h: size.row, w: size.col}, () => {
            });
          });

          socket.on('input', data => {
            console.log('socket input:', data);
            ttyStream.write(data);
          });

          container.wait();
      });
    });
  });

  return sockServer;
}
