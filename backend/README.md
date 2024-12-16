# kafka_node

## just a simple 
```
docker compose up
```
* would be sufficient to run the project
* but even if you want to run the project without docker, you can do that too
* just read the guide below


To install dependencies:

## i've used bun instead of npm but you can use npm if you want
```bash
bun install
```

To run:

```bash
bun run dev
```


## guide (covering the edge cases)
1. if you want to run the project out of the docker container, you'll have to use `localhost` as a value of POSTGRES_DB in .env *and* in `src/actions/db_connections.ts` both file
