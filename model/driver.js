module.exports = {
  async getRequest(status, driverId = '') {
    //GET ALL USER REQUEST WHICH ARE PENDING
    let query = {};
    if (status) {
      query.status = status;
    }
    //IF STATUS != W THEN PASS DRIVERID TO GET DRIVER ONGOING AND COMPLETED REQUEST
    if (status && status !== 'W') {
      query.driverId = driverId;
    }
    const sort = {requestedTimeStamp: 1};
    let result = await mongoClient.collection(cabRequestDB).find(query).sort(sort).toArray();

    return await result;
  },
  async submitRequest(data) {
    const query = { _id: objectID(data.requestId) };
    const updateParam = {
      $set: {
        driverId : data.driverId,
        status   : 'O',
        pickedOn : new Date()
      }
    };
    let result = await mongoClient.collection(cabRequestDB).update(query, updateParam);

    //REQUEST ASSIGNED TO DRIVER NOW CHANGE STATUS OF DRIVER TO ONGOING
    const driverQuery       = { _id: objectID(data.driverId) };
    const updateParamDriver = {
      $set: {
        status   : 'O'
      }
    };
    let driverResult = await mongoClient.collection(driverDB).update(driverQuery, updateParamDriver);

    //NOW SCHEDULE MSG WITH 5 MINS DELAY TO QUEUEING SERVICE(RABBITMQ)
    return await driverResult;
  },

  async checkDriverStatus(driverId) {
    const query = {_id : objectID(driverId)};
    let result = await mongoClient.collection(driverDB).findOne(query);

    return await result;
  },

  async checkRequestStatus(requestId) {
    const query = {_id : objectID(requestId)};
    let result = await mongoClient.collection(cabRequestDB).findOne(query);

    return await result;
  }
};

const addChildrenToNode = function (node, result) {
  let currentNodeId = node._id;
  node.child_categories = [];

  result.forEach(function (e) {
    delete e.ancestors;

    e.parent      = e.parent ? e.parent.toString() : e.parent;
    currentNodeId = currentNodeId ? currentNodeId.toString() : currentNodeId;

      if(e.parent === currentNodeId){
        e = addChildrenToNode(e, result);
        node.child_categories.push(e);
      }
  });

  return node;
};

