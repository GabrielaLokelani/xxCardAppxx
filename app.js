const createError = require('http-errors');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');



// HIDE YOUR MONGO CONNECTION VARIABLES 

require('dotenv').config();


// MONGO DB CONNECTION

mongoose.connect(process.env.DB_URI, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(res => console.log("MongoDB connected!"))
.catch(err => console.log(err));


// ESTABLISH ROUTES

const app = express();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutRouter = require('./routes/about')




// VIEW ENGINE SETUP

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

hbs.registerPartials(__dirname + '/views/partials');


// UNRESTRICTED ROUTES

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/users/register', usersRouter);
app.use('/users/login', usersRouter);



// RESTRICTED ROUTES

app.use('/users/logout', usersRouter);

// CATCH 404 AND FORWARD TO ERROR HANDLER

app.use(function(req, res, next) {
  next(createError(404));
});


// ERROR HANDLER

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // RENDER THE ERROR PAGE

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
