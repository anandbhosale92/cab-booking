const user           = require('../model/user');
const moment         = require('moment');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');

const response = {};
module.exports = {
  async requestCab(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['userId'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 1;

      sendResp.sendResponse(response);
    }

    if (!objectID.isValid(data.userId)) {
      response.type = 'E';
      response.code = 2;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER EXISTS
    const isExists = await user.checkUser(data);

    if(!isExists) {
      response.type = 'E';
      response.code = 21;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER PAYMENT MODE

    //VALIDATION SUCCESSFULL MOVE FORWARD
    //STORE REQUEST
    try {
      const resp = await user.requestCab(data);
      const resTxt    = { msg: "Cab request submitted successfully", requestId: resp.insertedIds[0] };
      response.type   = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 4;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  },
  async checkRequest(req, res, next) {
    response.res = res;

    let data = req.body;

    //VALIDATION PART
    //CHECK IF REQUIRE FIELD ARE PASSED OR NOT
    const requiredParam = ['userId', 'requestId'];
    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 5;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER EXISTS
    const isExists = await user.checkUser(data);

    if(!isExists) {
      response.type = 'E';
      response.code = 21;

      sendResp.sendResponse(response);
      return;
    }

    //ALL SET
    try {
      const resp = await user.checkRequest(data);
      const temp = {};

      let cabStatus = 'Waiting';
      if (resp.status === 'O') {
        cabStatus     = 'On Going'
        temp.driverId = resp.driverId;
        //ALSO WE CAN PASS DRIVER DETAIL SUCH AS HIS TOTAL TRIP TILL NOW, RATING
      }
      if (resp.status === 'C') {
        cabStatus        = 'Completed'
        temp.driverId    = resp.driverId;
        temp.completedOn = commonFunction.getDateTimeFromUNIX(resp.completedTimeStamp);
      }

      const startDate   = moment(resp.requestedTimeStamp, 'YYYY-M-DD HH:mm:ss');
      const endDate     = moment();
      const timeElapsed = endDate.diff(startDate, 'minutes');
      //GENERATE RESPONSE

      temp.requestId     = resp._id;
      temp.status        = cabStatus;
      temp.requestedTime = commonFunction.getDateTimeFromUNIX(resp.requestedTimeStamp);;
      temp.timeElapsed   = timeElapsed;

      if (resp) {
        response.type   = 'S';
        response.result = temp;

        sendResp.sendResponse(response);
        return;
      }
     }
    catch (e) {
      response.type = 'E';
      response.code = 7;

      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  },
  async getRequest(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['userId'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 1;

      sendResp.sendResponse(response);
      return;
    }

    if (!objectID.isValid(data.userId)) {
      response.type = 'E';
      response.code = 2;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER EXISTS
    const isExists = await user.checkUser(data);

    if(!isExists) {
      response.type = 'E';
      response.code = 21;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER PAYMENT MODE

    //VALIDATION SUCCESSFULL MOVE FORWARD
    //STORE REQUEST
    try {
      const resp = await user.getUserRequest(data);
      if (resp.length <= 0) {
        response.type = 'E';
        response.code = 22;

        sendResp.sendResponse(response);
        return;
      }

      const formattedResp = [];
      for (const request of resp) {
        let status = 'Waiting';
        if (request.status == 'O') {
          status = 'Ongoing';
        }
        if (request.status == 'c') {
          status = 'completed';
        }
        const startDate   = moment(request.requestedTimeStamp, 'YYYY-M-DD HH:mm:ss');
        const endDate     = moment();
        const timeElapsed = endDate.diff(startDate, 'minutes');
        const temp = {
          requestId   : request._id,
          status      : status,
          requestOn   : commonFunction.getDateTimeFromUNIX(request.requestedTimeStamp),
          timeElapsed : timeElapsed,
        };

        formattedResp.push(temp);
      }

      response.type   = 'S';
      response.result = formattedResp;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 4;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  },
  async register(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['name', 'email', 'password', 'confirmPass', 'mobile'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 17;

      sendResp.sendResponse(response);
      return;
    }

    if(data.password !== data.confirmPass) {
      response.type = 'E';
      response.code = 18;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER ALREADY EXSITS OR NOT
    const isExists = await user.checkUser(data);
    if(isExists) {
      response.type = 'E';
      response.code = 19;

      sendResp.sendResponse(response);
      return;
    }

    //ALL SET CREATE USER
    try {
      const resp = await user.createUser(data);
      const resTxt    = { msg: "User created successfully", userId: resp.insertedIds[0] };
      response.type   = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 20;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  }

};
