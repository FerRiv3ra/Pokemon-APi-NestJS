<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Run in develop

1. Clone the repo.
2. Run

```batch
npm install
```

3. Install Nest CLI

```
npm i -g @nestjs/cli
```

4. Run DB

```
docker-compose up -d
```

5. Clone file `.env.template` and rename to `.env`

6. Fill in the environment variables defined in `.env`

7. Run the applicaion in dev mode

```
npm run start:dev
```

8. Execute SEED for test CRUD

```
http://localhost:3000/api/seed
```

## Stack

- Nest
- MongoDB

# Production build

1. Create file `.env.prod`
2. Fill in the environment variables for production
3. Create the new Docker image

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
