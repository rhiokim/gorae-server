const Promise = require('bluebird');
const JSONStream = require('JSONStream');
const EventStream = require('event-stream');
const Dockerode = require('dockerode');

const docker = Promise.promisifyAll(new Dockerode());

module.exports = (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  docker.versionAsync()
  .then(version => console.info(version))
  .then(() => docker.getEventsAsync())
  .then(stream => stream
    .pipe(JSONStream.parse())
    .pipe(EventStream.mapSync(data => {
      res.write('data: ' + JSON.stringify(data) + '\n\n');
    }))
  ).catch(e => console.error(e));
};
