require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fileUpload = require("express-fileupload");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose"); //added

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var producRouter = require("./routes/productRouter");
var uploadRouter = require("./routes/uploadRouter");
var categoryRouter = require("./routes/categoryRouter");
var customerRouter = require("./routes/customerRouter");
var authRoutes = require("./routes/authRouter");
var verifyToken = require("./routes/validate-token");
const petaniRouter = require("./routes/PetaniRouter");
const farmRouter = require("./routes/farmRouter");
const checkoutRouter = require("./routes/CheckoutRouter");

var app = express();
//mongodb local
// var url = 'mongodb://localhost:27017/smartFarm';//added
//mongodb cloud

var url = `${process.env.MONGO_URL}`;
var connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}); //added

connect.then(
  (db) => {
    //added
    console.log("Berhasil connect Mongo DB");
  },
  (err) => {
    console.log("Error DB: " + err);
  }
);

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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
//Menuju router
app.use("/", indexRouter);
app.use("/product", producRouter);
app.use("/upload", uploadRouter);
app.use("/category", categoryRouter);
app.use("/customer", verifyToken, customerRouter);
app.use("/user", authRoutes);
app.use("/petani", petaniRouter);
app.use("/farm", farmRouter);
app.use("/checkout", checkoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;
