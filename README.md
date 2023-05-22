<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Run in dev mode
1. Clone the repo
2. Run 
```
yarn install
```
3. Install Nest CLI
```
npm install -g @nestjs/cli
```
4. Start the database
```
docker-compose up -d
```
5. Clone __.env.template__, rename it to __.env__.

6. Fill .env data.

7. Run the application in dev mode:
```
yarn start:dev
```

8. Populate database from seed
```
127.0.0.1:3000/api/v2/seed
```
Remember, you can change the constant value "POKEMON_LIMIT" (seed.service.ts) to another number to get that quantity of Pokémon to populate the database.

# Production Build
1. Create ```.env.prod``` file.
2. Fill the envoriment variables.
3. Create a new image
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Stack:
* MongoDB
* NestJS

