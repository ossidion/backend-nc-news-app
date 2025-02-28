# NC News Seeding

- The creation of two files is required in /db. These files will be:
    .env.test
    .env.development

In order to connect to both of these databases locally please write the following in each of the files:

        .env.test:

        PGDATABASE=nc_news_test


        .env.development:

        PGDATABASE=nc_news