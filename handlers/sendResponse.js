
const errMsg = [];

errMsg[1] = 'Required field not passed';
errMsg[2] = 'Invalid input passed.';
errMsg[3] = 'Your request has already submitted.';
errMsg[4] = 'Unable to process request. Please try again later.';
errMsg[5] = 'Required field not passed';
errMsg[6] = 'No such request found aginst particular Id.';
errMsg[7] = 'Unable to process request. Please try again later.';
errMsg[8] = 'Invalid input passed.';
errMsg[9] = 'No driver found against particular Id.';
errMsg[10] = 'No record found.';
errMsg[11] = 'Unable to process request. Please try again later.';
errMsg[12] = 'Required field not passed';
errMsg[13] = 'Invalid input passed.';
errMsg[14] = 'You are already allocatted to another ongoing request. This request cannot be fullfilled.';
errMsg[15] = 'Request is already assign to another driver.';
errMsg[16] = 'Unable to process request. Please try again later.';
errMsg[17] = 'Required field not passed';
errMsg[18] = 'Password and confirm password do not match';
errMsg[19] = 'User already exsits,';
errMsg[20] = 'Unable to process request. Please try again later.';
errMsg[21] = 'User do not exsits against following Id.';
errMsg[22] = 'No request created by you.';
errMsg[23] = 'Unable to process request. Please try again later.';

module.exports = {
  sendResponse(data) {

    //ERROR REQUEST
    if (data.type === 'E') {
      data.res.status(400).json({ msg: errMsg[data.code], code : data.code });
      return;
    }

    data.res.status(200).json(data.result);
    return;
  }
};
