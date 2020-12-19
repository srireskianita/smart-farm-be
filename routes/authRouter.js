const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const emailService = require("../utils/nodemailer");

const User = require("../models/customerModel");
const {Code} = require("../models/secretCodeModel");

// validation
const { registerValidation, loginValidation } = require("../helper/validate");

// register route
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const errors = []
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });

    if (isEmailExist)
      return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    let user = new User({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      password,
      phoneNumber: req.body.phoneNumber,
      accountType: req.body.accountType
    });


    const savedUser = await user.save()
    const token = jwt.sign(
      {
        userId: savedUser._id,
        userIsVerified: savedUser.isVerified,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '1h',
      }
    );

    req.session.token = token;

    const baseUrl = req.protocol + "://" + req.get("host");
    const secretCode = cryptoRandomString({
      length: 6,
    });
    const newCode = new Code({
      code: secretCode,
      email: savedUser.email,
    });
    await newCode.save();

    const data = {
      from: 'no-reply@delharvest.com',
      to: savedUser.email,
      subject: "Your Activation Link for DEL HARVEST",
      text: `Please use the following link within the next 1 hour to activate your account on DEL HARVEST: ${baseUrl}/user/verification/verify-account/${savedUser._id}/${secretCode}`,
      html: `<p>Please use the following link within the next 1 hour to activate your account on DEL HARVEST: <strong><a href="${baseUrl}/user/verification/verify-account/${savedUser._id}/${secretCode}" target="_blank">Email Confirmation</a></strong></p>`,
    };
    await emailService.sendMail(data);

    res.json({
      success: true,
      userId: savedUser._id,
      userStatus: savedUser.isVerified,
    });
  } catch (err) {
    console.log("Error on /user/register: ", err);
    errors.push({
      msg: "Oh, something went wrong. Please try again!",
    });
    res.json({ success: false, errors });
  }
});

router.get(
  "/verification/verify-account/:userId/:secretCode",
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const response = await Code.findOne({
        email: user.email,
        code: req.params.secretCode,
      });
      if (!user) {
        res.sendStatus(401);
      } else {
        await User.updateOne(
          { email: user.email },
          { isVerified: true }
        );
        await Code.deleteMany({ email: user.email });

        res.json({
          success: true,
          email: user.email,
        });
      }
    } catch (err) {
      console.log(
        "Error on /user/verification/verify-account: ",
        err
      );
      res.sendStatus(500);
    }
  }
);

router.post("/login", async (req, res, next) => {
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  try{
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(401).send({ error: "Email is wrong" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).send({ error: "Password is wrong" });

  const token = jwt.sign(
    // payload data
    {
      name: user.name,
      id: user._id,
      accountType: user.accountType,
      isVerified: user.isVerified
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: '24h',
    }
  );


  if(user.isVerified === true){
    req.session.token = token;
    res.header("auth-token", token).status(200).json({
      success: true,
      error: null,
      data: {
        id: user._id,
        name: user.name,
        accountType: user.accountType,
        token,
      },
    })
  } else {
    res.status(401).json({ 
      success: false,
      message : 'Your account is not active'
    });
  }
}catch (err) {
  console.log("Error on /user/login: ", err);
  res.status(400).send({ success: false });
}
});

router.get("/logout", (req, res) => {
  req.session = null;
  res.json({ success: true });
});

module.exports = router;