const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require("fs");
const session = require("express-session");
require("dotenv").config();
require("./config/db")()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const app = express();

// globalniy router
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null
  next();
})

// validator
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: "cartboard-key",
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))



// Lnaguage Middlaware 
app.use((req, res, next) => {
  if(!req.session.lang) req.session.lang = "uz"
  if(req.query.lang) req.session.lang = req.query.lang;
  
  const file = "./config/lang/" + req.session.lang + ".json"
  // console.log(file);
  // console.log(req.session.lang);

  fs.readFile(file, (err, data) => {
    if(err) res.send("Error loading language file: " + file);
    else {
      l = JSON.parse(data)
      next();
    }
  })
})

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
