# building_scraper
Scrapes info about Oregon State University buildings, placing the data in a
MongoDB database.

## Running the code
Ensure the `API_KEY` and `MONGO_URL` environment variables are set and run:

```bash
npm install
npm start
```

Alternatively, you can run the scraper in docker-compose (the `API_KEY`
environment variable will be passed on to the container):

```bash
docker-compose up
```

Running in docker-compose is intended only for development purposes. To aid in development, you can access the database via the mongo shell by running:

```bash
docker-compose run db_shell
```
