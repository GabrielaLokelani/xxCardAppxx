const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// GET LOGIN USER PAGE

router.get('/login', function(req, res, next) {
  res.render('login');
});

// POST USER LOGIN

router.post('/login', async function(req, res) {
  const {username, password} = req.body;

  let user;
  let match;

  if (username != '' && password != '') {
    if (username.length < 5 ) {
      return res.render('login', { messages: ["Username must be at least 5 aplhanumeric chars in length."] });
    } else if (password.length < 8 || !(/^[a-zA-Z\d\-_]+$/.test(password))) {
      return res.render('login', { messages: ["Password must be at least 8 aplhanumeric chars in length."] });
    } else {
      user = await User.findOne({username: username});
      if (user != null) {
        match = await bcrypt.compare(password, user.password);
      } else {
        return res.render('login', { messages: ["User not found."] });
      }
    }
  } else {
    return res.render('login', { messages: ["Please fill in all fields!"] });
  }

  if (match) {
    const payload = { id: user._id, username: username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '6h'});

    res.cookie('access_token', token);

    res.redirect('/');

  } else {
    res.render('login', { messages: ["Invalid password."] });
  }
})


// GET REGISTER USER PAGE

router.get('/register', function(req, res, next) {
  res.render('register');
});

// POST NEW USER

router.post('/register', function(req, res, next) {
  const {username, password, repeatPassword} = req.body;

  if (username != '' && password != '' && repeatPassword != '') {
    if (password != repeatPassword) {
      return res.render('register', { messages: ["Password does not match re-password!"] });
    } else {
      if (password.length < 8 || !(/^[a-z\d\-_]+$/.test(password))) {
        return res.render('register', { messages: ["Password must be at least 8 aplhanumeric chars in length."] });
      } else {
        const salt = bcrypt.genSaltSync(+process.env.SALT);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({
          username,
          password: hash
        });
        newUser.save((err) => {
          if (err) {
            const errMsg = newUser.validateSync().errors;
            let messages = [];
            if (errMsg.username) {
                console.log(errMsg.username.properties.message);
                messages.push(errMsg.username.properties.message);
            };
            return res.render('register', { messages: messages });
          } else {
            return res.redirect('/users/login');
          };
        });
      };
    };
  } else {
    res.render('register', { messages: ["Please fill in all fields!"] });
  }
});

// LOGOUT USER

router.get('/logout', function(req, res, next) {
  res.clearCookie('access_token');
  res.clearCookie("selected_cards");
  res.redirect('/');
});

module.exports = router;