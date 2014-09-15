var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app, express){
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
   extended: true
 }));
  app.use(session({
    secret: 'cat baby',
    resave: true,
    saveUninitialized: true
  }));
  app.use(express.static(path.join(__dirname, '../client/www')));

  require('./handler.js')(app);
}