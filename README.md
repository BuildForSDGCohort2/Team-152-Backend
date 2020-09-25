# TEAM-152-BACKEND API Backend

This API is for digital skill sharing website. There are several endpoints exposed in this API, and protected onces and resources.

## Installation and Running this APP

Clone this repo, then: 

``` bash
npm install
npm start
```

The app will be served at `http://localhost:3000`.


## Local Setup

To setup the API locally, you will need to run XAMMP MysQl Server or locally hosted MysQl server or a remote database service provider. run the bash command: `cp .env.example .env` and the database configuration to point to the running MySQL server already running on your computer. next

```
npm install
npm run start:dev
```

This will create all related tables if not exist and start the application.


## Available Routes

#### **POST** `/api/login`