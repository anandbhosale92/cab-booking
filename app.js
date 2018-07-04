
// Bring in our dependencies
const
  express    = require('express');
  app        = express(),
  bodyParser = require('body-parser'),
  routes     = require('./routes'),
  mongo      = require('mongodb').MongoClient,
  objectID   = require('mongodb').ObjectID,
  PORT       = process.env.PORT || 3000,
  mongoUrl   = process.env.MONGOURL || 'mongodb://localhost:27017/houm';

mongo.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  }

  global.mongoClient   = db;
  global.objectID      = objectID;
  global.driverDB      = process.env.driverDB || 'driver';
  global.userDB        = process.env.userDB || 'user';
  global.transactionDB = process.env.transactionDB || 'transaction';
  global.cabRequestDB  = process.env.cabRequestDB || 'cabrequest';
});
app.use(bodyParser.json());
//  Connect all our routes to our application
app.use('/', routes);
app.use('/dashboard', express.static(__dirname+'/view'));

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
