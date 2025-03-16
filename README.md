# NC News

Welcome to the NC News app. This API has been developed by Alex Graham for the purpose of accessing application data programmatically. The intention here is to mimic the building of a RESTful server for a real world backend service (such as reddit) which provides information to the front end architecture.

The database is PSQL, and it interacts via node-postgres. 

Please find a link to the hosted version here: https://backend-nc-news-app.onrender.com/api


## Instructions

### Clone

Please fork the repository in Github and then clone to your machine. 

### Installation of Dependencies

Please then run npm i to install all dependencies (which includes developer dependencies)

###  Seeding of Database

- The creation of two files is required in /db. These files will be:
    .env.test
    .env.development

In order to connect to both of these databases locally please write the following in each of the files:

         #### .env.test:

        PGDATABASE=nc_news_test


        
        #### .env.development:

        PGDATABASE=nc_news

### Running tests


