# 概要
PrAha Challengeの設計課題の雛形に使用するレポジトリです

## Dockerの実行

```
$ docker build -t my-nest-app -f .docker/app/Dockerfile .
$ docker run -p 3001:3001 my-nest-app
$ curl http://localhost:3001/pairs
```