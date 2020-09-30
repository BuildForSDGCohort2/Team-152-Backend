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

#### **POST** `/api/signup`
* Used for signing up a user. Accepts:
```
{
	"name": "Ekenekiso Leonard",
  "phone": "08066607729",
  "email": "gadfesfeeu@gmail.com",
  "gender": "male",
  "location": "Port Harcourt",
  "jobRole": "Full Stack Developer",
  "skill": [
		{"TechStackId": "1"},
		{"TechStackId": "2"},
		{"TechStackId": "3"},
		{"TechStackId": "4"},
		{"TechStackId": "5"}
	],
  "technologyYouCanTeach": [
		{"TechStackId": "1"},
		{"TechStackId": "2"},
		{"TechStackId": "3"},
		{"TechStackId": "4"},
		{"TechStackId": "5"}
	],
  "password": "syndicate",
	"passwordConfirmation": "syndicate"
}
```
and returns:
```
{
  "success": true,
  "message": "Account created",
  "code": 201,
  "data": {
    "id": 42,
    "name": "Ekenekiso Leonard",
    "phone": "08066607729",
    "email": "gadfesfeeu@gmail.com",
    "gender": "male",
    "location": "Port Harcourt",
    "jobRole": "Full Stack Developer",
    "password": "",
    "updatedAt": "2020-09-27T22:45:53.362Z",
    "createdAt": "2020-09-27T22:45:53.362Z",
    "skill": [
      {
        "id": 201,
        "TechStackId": "1",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.451Z",
        "updatedAt": "2020-09-27T22:45:53.451Z"
      },
      {
        "id": 202,
        "TechStackId": "2",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.451Z",
        "updatedAt": "2020-09-27T22:45:53.451Z"
      },
      {
        "id": 203,
        "TechStackId": "3",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.451Z",
        "updatedAt": "2020-09-27T22:45:53.451Z"
      },
      {
        "id": 204,
        "TechStackId": "4",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.451Z",
        "updatedAt": "2020-09-27T22:45:53.451Z"
      },
      {
        "id": 205,
        "TechStackId": "5",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.451Z",
        "updatedAt": "2020-09-27T22:45:53.451Z"
      }
    ],
    "technologyYouCanTeach": [
      {
        "id": 196,
        "TechStackId": "1",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.462Z",
        "updatedAt": "2020-09-27T22:45:53.462Z"
      },
      {
        "id": 197,
        "TechStackId": "2",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.462Z",
        "updatedAt": "2020-09-27T22:45:53.462Z"
      },
      {
        "id": 198,
        "TechStackId": "3",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.462Z",
        "updatedAt": "2020-09-27T22:45:53.462Z"
      },
      {
        "id": 199,
        "TechStackId": "4",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.462Z",
        "updatedAt": "2020-09-27T22:45:53.462Z"
      },
      {
        "id": 200,
        "TechStackId": "5",
        "UserId": 42,
        "createdAt": "2020-09-27T22:45:53.462Z",
        "updatedAt": "2020-09-27T22:45:53.462Z"
      }
    ]
  },
  "error": {}
}
```
 A json response payload. the error property will be populated if there's an error during execution of the create process.

#### **POST** `/api/login`
#### **POST** `/api/login`
* Used for signing in a user. Accepts: 
```
{
	"email": "ugbanawaji.ekenekiso@ust.edu.ng",
	"password": "syndicate"
}
```
 Returns a 4 digit token over SMS and the provide phone number as response payload.

Example response payload: successful attempt to login

```
{
  "success": true,
  "status": 200,
  "message": "token sent to: +2348077471000",
  "properties": {
    "phone": "2348077471000"
  }
}
```