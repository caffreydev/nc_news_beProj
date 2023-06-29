# Northcoders News API - Joe McCaffrey


<br>


# Links
Public Github repo: https://github.com/joemccaffrey-dev/nc_news_beProj.git

Hosted production server: https://nc-news-jm.onrender.com 

<br>

# Overview
This is a Javascript back end project piece centered around an api server supported by a postgres sql database with several linked tables.  The code and instructions within this repo are everything needed to allow you to pull your own version to host development and/or test servers and databases locally.  There is also a hosted production server (linked above), and hosted production database, allowing you to explore the functionality direct from your browser.

<br>
The database contains 4 tables: articles, topics that the articles cover, comments on those articles, and users who comments are posted by.  Each of these tables is linked by foreign key relationships.  There are various endpoints and methods by which users can interact with the server, with parameters and queries on endpoints allowing customisation of data received - 
e.g. getting all articles with a specific topic in a chosen sort order, or posting a comment to an article.  


<br>

A full description of functionality is available in a JSON contents page with a description of available endpoints and their respective details.  This can be found either by viewing the ./app/endpointsList.json file within this repo or by visiting the /api endpoint on the hosted server.  Where bad requests are made, such as an invalid user id (i.e non integer) being specified, error handling will prevent the action and instead respond with the appropriate html 4-- status code and an error message.

<br>

Feel free to just use the hosted server to explore the project, in which case most of the following readme won't be needed - you are good to go, just visit https://nc-news-jm.onrender.com/api for the list of endpoints and you can start playing around in your browser!

<br>

Alternately if you do wish to pull the repo and either use locally or host your own production server and database then continue reading on for instructions.  


<br>

# Instructions for Developers

This repo contains all* the files and code necessary to work locally in a development and/or test environment, or to host your own production version if desired. 

**Almost all - you will also need to install the dependencies in the package.json, and read and action the final note below on setting up your dot env files.*

## Development and Test
First clone this repo to your own machine - pull requests will not be accepted, so if you wish to push changes to github please create your own blank github repo and set the remote origin to this.  Then follow the appropriate steps below.

Steps For Development:
1. Install the dependencies in the package.json file
2. Create your own development environment variable file as described in the note below 
3. Run the 'setup-dbs' script (npm run setup-dbs)
4. Run the seed script (npm run seed)
5. Run the listen.js file (node listen)
6. Open your browser and enter "localhost:[portnumber]" - "[port number]" will be the number logged in your console.

Steps for Testing:
1. Install the dependencies and developer dependencies in the package.json file
2. Create your own test environment variable file as described in the note below
3. Run npm test


Steps for Production:

Creating your own production version will depend on the services you are using for your hosted server and database.  Once you have setup these services and followed their instructions follow the steps below:
1. Install the dependencies in the package.json file
2. Create your own production environment variable file as described below
3. Run the seed-prod script (npm run seed-prod)


<br>

# Important Usage Note: Setting up Environment Variable Files
Included in git ignore are three .env files that set the PGDATABASE global variable for respectively development, testing, and production.  If pulling a copy to work with or use you will need to create one or more of your own versions of these file(s) as below, depending on use.  Each of these must be saved in the root folder if relied on:

For development purposes:
File name: ".env.development", File content: "PGDATABASE=nc_news"

For test purposes:
File name: ".env.test", File content: "PGDATABASE=nc_news_test"

For production purposes:
File name ".env.production", File content: "DATBASE_URL=<'enter your hosted url here'>"

