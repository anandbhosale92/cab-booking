# Houm Task

Restful API in node.js, mongoDB.
All Post request should be in JSON format.

### Installation

Install the dependencies and start the server.

```sh
$ cd houm
$ npm install
$ npm start
```

### Usage Example:
#####  { Create User }
API to create new User. If already exists then error is thrown
###### Required Param : [name, mobile, email, password, confirmPass]
Test Cases:-
```sh
Url         : localhost:3000/user/register
http method : POST
Post Data  : {
    "name": "anand",
    "email": "anand@gmail.com",
    "password": "123456",
    "confirmPass": "123456",
    "mobile": "9898989898"
}
Response: {
  "msg": "User created successfully",
  "userId": "5b3b0e239c2eb00937aa7e23"
}
```
#####  { Create New Request }
API to create new request.
User can send multiple request
###### Required Param : [userId]
Test Cases:-
```sh
Url         : localhost:3000/user/requestCab
http method : POST
Post Data  : {
          "userId": "5b3a1548464e3f70a59684d6"
        }
Response: {
    "msg": "Cab request submitted successfully",
    "requestId": "5b3a1cae56465610920663a1"
}
```
#####  { Get all request (User Part)}

###### Required Param : [userId]
API to get all request made by particular user
Test Cases:-
```sh
Url         : localhost:3000/user/getrequest
http method : POST
Post Data  : {
          "userId": "5b3a1548464e3f70a59684d6"
        }
Response: [
    {
        "requestId": "5b3a15659e2d9a0d22044f02",
        "requestOn": "2018-07-02T12:07:01.021Z"
    },
    {
        "requestId": "5b3a1aad7171e3105e808f89",
        "requestOn": "2018-07-02T12:29:33.941Z"
    },
    {
        "requestId": "5b3a1cae56465610920663a1",
        "requestOn": "2018-07-02T12:38:06.113Z"
    }
]
```
#####  {Check for request status}
API to check the status of request made by user.
Test Cases:-
```sh
Url         : localhost:3000/user/checkRequest
http method : POST
Post Data  : {
  "userId": "5b3a1548464e3f70a59684d6",
  "requestId": "5b3a1cae56465610920663a1"
}
Response: {
    "driverId": "5b39ee3d464e3f70a59677a4",
    "requestId": "5b3a1cae56465610920663a1",
    "status": "On Going",
    "requestedTime": "2018-07-02 18:08:06",
    "timeElapsed": 149
}

```
#### DRIVER PART
#####  { Get all waiting request }
API to get all waiting list request of users
###### Required Param : [Driver Id]
Test Cases:-
```sh
Url         : localhost:3000/driver/waitingrequest/5b11350a52ac9660810fe38d {driver Id}
http method : GET
Response: {
    "msg": "Empty waiting list.",
    "code": 10
}
```
#####  {Select Request}
API allow driver to select the waiting request
After selecting API automatically change the state of request to onGoing and driver status also changed to ongoing.
Test Cases:-
```sh
Url         : localhost:3000/driver/submitrequest
http method : POST
Post Data:   {
  "driverId": "5b39ee3d464e3f70a59677a4",
  "requestId": "5b3a1cae56465610920663a1"
}

Response: {
    "requestId": "5b3a41284ddeaa1419b1f4cc",
    "userName": "Anand",
    "mobile": 9022300608
}
```

### Database Schema:
#### user
```sh
{
_id : Mongo ObjectId,
  name: String,
  email: String, // unique
  mobile: number,
  password: String
}
```
#### driver
```sh
{
_id : Mongo ObjectId,
  name: String,
  email: String, // unique
  gender: String,
  mobile: number,
  password: String,
  status: String,
  totalTrips : Number
}
```

#### cabrequest
```sh
{
  _id : Mongo ObjectId,
  userId : Mongo ObjectId,
  driverId : Mongo ObjectId,
  status: String,
  requestedOn : TimeStamp,
  pickedOn : timeStamp,
  pickedOn : timeStamp
}
```
