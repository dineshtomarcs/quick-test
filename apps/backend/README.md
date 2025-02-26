# NestJS REST API for BugPlot

## Description 

NestJS REST API boilerplate for typical project

[Full documentation here](https://github.com/aashishdhawan/bugplot-backend/blob/dev/README.md)

## Table of Contents 

- [Features](#features)
- [Quick run](#quick-run)
- [Comfortable development](#comfortable-development)
- [Links](#links)
- [Automatic update of dependencies](#automatic-update-of-dependencies)
- [Database utils](#database-utils)
- [Tests](#tests)
- [Tests in Docker](#tests-in-docker)
- [Test benchmarking](#test-benchmarking)

## Features

- [X] Database ([typeorm](https://www.npmjs.com/package/typeorm)).
- [X] Seeding.
- [X] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer)).
- [X] Sign in and sign up via email.
- [X] Admin and User roles.
- [X] I18N ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [X] File uploads. Support local and Amazon S3 drivers.
- [X] Swagger.
- [X] E2E and units tests.
- [X] Docker.
- [X] CI (Github Actions).

## Quick run

```bash
git clone --depth 1 https://github.com/aashishdhawan/bugplot-backend.git bugPlot_Backend
cd bugPlot_Backend/
cp .env.example .env
docker compose up -d
```

For check status run

```bash
docker compose logs
```

## Comfortable development

```bash
git clone --depth 1 https://github.com/aashishdhawan/bugplot-backend.git bugPlot_Backend
cd bugPlot_Backend/
cp .env.example .env
```

Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

Run additional container:

```bash
docker compose up -d postgres adminer maildev
```

```bash
yarn install

yarn run migration:run

yarn build

yarn start
```

## Links

- Swagger: [http://localhost:3001/testbox-documentation](http://localhost:3001/testbox-documentation)
- Adminer (client for DB): [http://localhost:8080](http://localhost:8080)
- Maildev: [http://localhost:1080](http://localhost:1080)

## Automatic update of dependencies

If you want to automatically update dependencies, you can connect [Renovate](https://github.com/marketplace/renovate) for your project.

## Database utils

Run migration

```bash
yarn run migration:run
```

## Tests

```bash
# unit tests
yarn run test

## Tests in Docker

```bash
docker compose -f docker-compose.ci.yaml --env-file env-example -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```
