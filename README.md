
### Run with remote docker host

```bash
$ export DOCKER_HOST=tcp://192.168.99.116:2376
$ npm start
```

```bash
$ docker run -dit --name gorae-server -p 8082:8082 -e DOCKER_HOST=tcp://${DOCKER_HOST} gorae-server:latest
```

### Environment Variables

- `SSH_KEYGEN_DIR`:
- `REGISTRY_HOST`:
- `REGISTRY_PORT`:
