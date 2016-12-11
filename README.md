# ![](assets/image/gorae-github-banner.png)

### Endpoints

- `/api`: docker related APIs
- `/registry`: docker image registry related APIs
- `/utils`: system related APIs (Network Interfaces)
- `/gorae`: system related APIs (System Resources)

### Run with remote docker host

```bash
$ export DOCKER_HOST=tcp://192.168.99.116:2376
$ npm start
```

```bash
$ docker run -dit --name gorae-server -p 8082:8082 -e DOCKER_HOST=tcp://${DOCKER_HOST} gorae-server:latest
```

### Docker Registry

```
$ docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

* see more: https://github.com/docker/distribution/blob/master/docs/configuration.md

### Environment Variables
- `DOCKER_SOCK`:
- `REGISTRY_HOST`:
- `REGISTRY_PORT`:

> It should be separated each part of api server registry and docker engine

## License
