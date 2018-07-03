
const drivers        = require('../model/driver');
const users          = require('../model/user');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');

const response = {};
module.exports = {
  async getRequest(req, res, next) {
    try {
      //CHECK FOR DRIVER LOGIN  DETAIL
      response.res  = res;
      response.type = 'S';

      const driverId = req.params.driverId;

      if (!objectID.isValid(driverId)) {
        response.type = 'E';
        response.code = 8;

        sendResp.sendResponse(response);
        return;
      }

      //CHECK FOR DRIVER EXISTS
      const driverExists = await drivers.checkDriverStatus(driverId);
      console.log(driverExists);
      if(!driverExists) {
        response.type = 'E';
        response.code = 9;

        sendResp.sendResponse(response);
        return;
      }

      const resp = await drivers.getRequest();

      if (resp.length <= 0) {
        //NO WAITING REQUEST
        response.type = 'E';
        response.code = 10;

        sendResp.sendResponse(response);
        return;
      }

      let formattedResp = [];
      for (const request of resp) {
        const temp = {
          requestId : request._id,
          requestOn : request.requestedTimeStamp
        };

        formattedResp.push(temp);
      }

      if (resp) {
        response.result = formattedResp;
        sendResp.sendResponse(response);
        return;
      }
    }
    catch (e) {
      response.type = 'E';
      response.code = 11;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  },
  async submitRequest(req, res, next) {
    //VALIDATION PART
    response.res = res;
    let data     = req.body;

    const requiredParam = ['driverId', 'requestId'];
    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 12;

      sendResp.sendResponse(response);
      return;
    }

    if (!objectID.isValid(data.driverId) || !objectID.isValid(data.requestId)) {
      response.type = 'E';
      response.code = 13;

      sendResp.sendResponse(response);
      return;
    }
    //CHECK FOR DRIVER LOGIN DETAIL

    //CHECK FOR DRIVER EXISTS AND AVAIALABLE TO TAKE REQUEST
    const driverData = await drivers.checkDriverStatus(data.driverId);
    if(!driverData) {
      response.type = 'E';
      response.code = 9;

      sendResp.sendResponse(response);
      return;
    }
    if (driverData.status === 'O') {
      //CURRENTLY HANDLING ONGOING REQUEST SO OTHER COULD BE ASSIGNED
      response.type = 'E';
      response.code = 14;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR CAB REQUEST ISEXISTS AND NOT TAKEN BY ANY OTHER DRIVER
    const requestData = await drivers.checkRequestStatus(data.requestId);

    if(!requestData) {
      response.type = 'E';
      response.code = 19;

      sendResp.sendResponse(response);
      return;
    }
    if (requestData.status !== 'W') {
      //CURRENTLY REQUEST IS ALREADY ASSIGNED TO ANOTHER DRIVER
      response.type = 'E';
      response.code = 15;

      sendResp.sendResponse(response);
      return;
    }
    //ALL SET
    try {
      const resp = await drivers.submitRequest(data);
      if (resp) {
        //REQUEST ASSIGNED TO DRIVER NOW GET USER DETAIL FOR DRIVER
        const userData =  await users.getUserData(requestData.userId);

        const resData = {
          requestId : data.requestId,
          userName  : userData.name,
          mobile    : userData.mobile
        };

        //FURTHER CAN ADD USER POSITION FROM WHERE HE REQUESTED FOR CAN FROM THE REQUEST RESPONSE
        response.result = resData;
        response.type = 'S';

        sendResp.sendResponse(response);
        return;
      }
    }
    catch (e) {
      response.type = 'E';
      response.code = 16;
      if (typeof e === 'number') {
        response.code  = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  }
};
