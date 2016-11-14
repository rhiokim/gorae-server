const express = require('express');
const got = require('got');
const bluebird = require('bluebird');

const processUsage = require('../lib/processUsage');
const router = express.Router();
const sock = process.env.DOCKER_SOCK || '/var/run/docker.sock';

const docker = (method, path, options = {}) => {
  options = Object.assign({
    json: true
  }, options);

  return got[method](`unix:${sock}:${path}`, options);
}

router.get('/', (req, res) => {
  Promise.all([
    docker('get', '/nodes'),
    docker('get', '/services'),
    docker('get', '/tasks'),
    docker('get', '/containers/json'),
    docker('get', '/images/json'),
    docker('get', '/networks'),
    docker('get', '/volumes'),
  ])
    .then(responses => {
      res.json({
        nodes: responses[0].body.length,
        services: responses[1].body.length,
        tasks: responses[2].body.length,
        containers: responses[3].body.length,
        images: responses[4].body.length,
        networks: responses[5].body.length,
        volumes: responses[6].body.length,
      })
    })
    .catch(error => {
      res.status(error.statusCode)
        .send(error)
    });
});

router.get('/process', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  setInterval(() => res.write(`data: ${JSON.stringify(processUsage())}\n\n`), 1000)
})

module.exports = router;
