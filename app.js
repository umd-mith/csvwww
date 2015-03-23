var express = require('express');
var path = require('path');
var logger = require('morgan');
var multer = require('multer');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var models = require('./models');
var auth = require('./routes/auth');
var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var datasets = require('./routes/datasets');

var config = require('./config.json');
models.mongoose.connect(config.mongodb);

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest: './uploads'}));
app.use(bodyParser.json());

app.use(session({
  store: new MongoStore({mongooseConnection: models.mongoose.connection }),
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/users', users);
app.use('/datasets', datasets);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;