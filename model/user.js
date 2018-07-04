var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  async requestCab(data) {

    // let query = { userId: objectID(data.userId), status: 'W'};
    // //CHECK FOR USER HAS ALREADY REQUEST OR NOT
    // const result = await mongoClient.collection(cabRequestDB).find(query).toArray();

    // if (result.length > 0) {
    //   //USER HAS ALREADY IN REQUEST QUEUE
    //   throw 3;
    // }

    //ADD USER REQUEST
    const insertParam = {
      userId             : objectID(data.userId),
      status             : 'W',
      driverId           : '',
      requestedTimeStamp : new Date(),
      completedTimeStamp : ''
    };

    let resp = await mongoClient.collection(cabRequestDB).insert(insertParam);

    return await resp;
  },

  async checkRequest(data) {

    //GET CAB REQUEST FOR PARTICULAR USER
    const checkQuery = { _id: objectID(data.requestId), userId : objectID(data.userId) };
    const response = await mongoClient.collection(cabRequestDB).find(checkQuery).toArray();

    //NO SUCH REQUEST FOUND
    if (response.length < 0) {
      throw 6;
    }

    return await response[0];
  },
  async getUserRequest(data) {

    let query = { userId: objectID(data.userId), status: 'W'};
    //CHECK FOR USER HAS ALREADY REQUEST OR NOT
    const result = await mongoClient.collection(cabRequestDB).find(query).toArray();

    if (result.length > 0) {
      //USER HAS ALREADY IN REQUEST QUEUE
      throw 3;
    }

    //ADD USER REQUEST
    const insertParam = {
      userId             : objectID(data.userId),
      status             : 'W',
      driverId           : '',
      requestedTimeStamp : new Date(),
      completedTimeStamp : ''
    };

    let resp = await mongoClient.collection(cabRequestDB).insert(insertParam);

    return await resp;
  },

  async getUserData(userId) {
    const checkQuery = { _id: objectID(userId) };

    const response = await mongoClient.collection(userDB).find(checkQuery).toArray();

    //NO SUCH REQUEST FOUND
    if (response.length < 0) {
      throw 11;
    }

    return await response[0];
  },
  async getUserRequest(data) {

    //GET CAB REQUEST FOR PARTICULAR USER
    const checkQuery = { userId: objectID(data.userId) };
    const response = await mongoClient.collection(cabRequestDB).find(checkQuery).toArray();

    //NO SUCH REQUEST FOUND
    if (response.length < 0) {
      throw 6;
    }

    return await response;
  },

  async checkUser(data) {
    const checkQuery =  { $or: [{email: data.email}, {_id : objectID(data.userId) }]  };
    const response = await mongoClient.collection(userDB).findOne(checkQuery);

    return await response;
  },
  async createUser(data) {

    const insertParam = {
      email    : data.email,
      mobile   : data.mobile,
      name     : data.name,
      password : await bcrypt.hash(data.password, saltRounds),
      createdOn: new Date()
    };

    let resp = await mongoClient.collection(userDB).insert(insertParam);

    return await resp;
  }
};

