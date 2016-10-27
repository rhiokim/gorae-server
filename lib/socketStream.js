const stream = require('stream');
const util = require('util');

function SocketStream(socket) {
  stream.Writable.call(this);
  this.socket = socket;
}

util.inherits(SocketStream, stream.Writable);

SocketStream.prototype._write = function (chunk, encoding, done) {
  this.socket.emit('output', chunk.toString());
  done();
};

module.exports = SocketStream;
