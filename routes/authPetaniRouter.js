const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const emailService = require("../utils/nodemailer");

const User = require("../models/petaniModel");
const { Code } = require("../models/secretCodeModel");

// validation
const { registerValidation, loginValidation } = require("../helper/validate");

// register route
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });

    if (isEmailExist)
      return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      password,
      phoneNumber: req.body.phoneNumber,
      accountType: req.body.accountType
    });


    const savedUser = await user.save();
    const token = jwt.sign(
      {
        userId: savedUser._id,
        userIsVerified: savedUser.isVerified,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 14,
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
      subject: "Your Activation Link for YOUR APP",
      text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/userPetani/verification/verify-account/${savedUser._id}/${secretCode}`,
      html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/userPetani/verification/verify-account/${savedUser._id}/${secretCode}" target="_blank">Email Confirmation</a></strong></p>`,
    };
    await emailService.sendMail(data);

    res.json({
      success: true,
      userId: savedUser._id,
      userStatus: savedUser.isVerified,
    });
  } catch (err) {
    console.log("Error on /userPetani/register: ", err);
    errors.push({
      msg: "Oh, something went wrong. Please try again!",
    });
    res.status(400).json({ success: false, errors });
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
        "Error on /userPetani/verification/verify-account: ",
        err
      );
      res.sendStatus(500);
    }
  }
);

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(202).json({ error: "Email is wrong" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(202).json({ error: "Password is wrong" });

    const token = jwt.sign(
      // payload data
      {
        name: user.name,
        id: user._id,
        accountType: user.accountType,
        isVerified: user.isVerified
      },
      process.env.TOKEN_SECRET
    );
    if (user.isVerified === true) {
      res.header("auth-token", token).status(200).json({
        success: true,
        error: null,
        data: {
          id: user._id,
          name: user.name,
          accountType: user.accountType,
          token,
        },
      });
    } else {
      res.status(201).json({
        success: false,
        message: 'Your account is not active'
      });
    }
  } catch (err) {
    console.log("Error on /userPetani/login: ", err);
    res.json({ success: false });
  }
});

router.get("/logout", (req, res) => {
  req.session = null;
  res.json({ success: true });
});

module.exports = router;