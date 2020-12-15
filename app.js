require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fileUpload = require('express-fileupload')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); //added


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var producRouter = require('./routes/productRouter');
var uploadRouter = require('./routes/uploadRouter');
var categoryRouter = require('./routes/categoryRouter');
var customerRouter = require('./routes/customerRouter');
var authRoutes = require("./routes/authRouter");
var verifyToken = require("./routes/validate-token");

var app = express();
//mongodb local
// var url = 'mongodb://localhost:27017/smartFarm';//added
//mongodb cloud

var url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.kp0io.mongodb.net:27017,cluster0-shard-00-01.kp0io.mongodb.net:27017,cluster0-shard-00-02.kp0io.mongodb.net:27017/${process.env.DBNAME}?ssl=true&replicaSet=atlas-154yev-shard-0&authSource=admin&retryWrites=true&w=majority`
var connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}); //added

connect.then((db) => { //added 
  console.log('Berhasil connect Mongo DB');
}, (err) => {
  console.log('Error DB: ' + err)
});

//auth
// function auth (req,res,next){
//   //console.log(req.headers);
//   var authHeader = req.headers.authorization;
//   if(!authHeader){
//     var err = new Error('You are not authenticated');
//     res.setHeader('WWWW-Authenticate', 'Basic');
//     err.status =401;
//     next(err);
//     return;
//   }

//   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//   var user = auth[0];
//   var pass = auth[1];
//   if( user === 'admin' && pass === 'admin123'){
//     next();
//   } else {
//     var err = new Error('You are not authenticated');
//     res.setHeader('WWWW-Authenticate', 'Basic');
//     err.status =401;
//     next(err);
//   }
// }

// app.use(auth)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles: true
}))

//Menuju router
app.use('/', indexRouter);
app.use('/product',producRouter);
app.use('/upload',uploadRouter);
app.use('/category',categoryRouter);
app.use('/customer',verifyToken,customerRouter);
app.use("/user", authRoutes);



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
