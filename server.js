if (!process.env.PORT) {
  require('dotenv').config()
  process.env.NODE_ENV = "dev"
}

// MIDDLEWARE
// web framework - handles requests from different url paths (routes), enables
// POST, GET, DELETE and more, serves static files, and allows templates to be
// used to dynamically create the response
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
const express = require('express');
// The path module provides utilities for working with file and directory paths.
// https://nodejs.org/api/path.html
const path = require('path');
// A favicon is a visual cue that client software, like browsers, use to identify a site.
// https://expressjs.com/en/resources/middleware/serve-favicon.html
const favicon = require('serve-favicon');
// morgan allows easy logging of requests, errors, and more to the console
const logger = require('morgan');
// cookie-parser makes it possible to read, send, and review cookies
// https://videlais.com/2020/03/02/working-with-cookies-in-node-express-using-cookie-parser/
const cookieParser = require('cookie-parser');
// bodyParser handles HTTP POST requests
const bodyParser = require('body-parser');
// methodOverride lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const methodOverride = require('method-override')

const app = express();

const mongoose = require('mongoose');
// handles connecting to the MongoDB database
mongoose.connect('mongodb://localhost/petes-pets', { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index.js')(app);
require('./routes/pets.js')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.PUBLIC_STRIPE_API_KEY = process.env.PUBLIC_STRIPE_API_KEY

module.exports = app;
