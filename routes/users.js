const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Card = require('../models/Card');
const saltRounds = +process.env.SALT
const secretKey = process.env.JWT_SECRET

// GET LOGIN USER PAGE

router.get('/login', function(req, res, next) {
  console.log("LOGIN PAGE")
  res.render('login', { messages: ["Enter user login."] });
});

// POST USER LOGIN

router.post('/login', function(req, res) {
  // const card = new Card({
  //   cardName: "Test Card",
  //   cardDescription: "Test Card Description"
  // })
  // console.log(card)
  // card.save()
  res.redirect('/')
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
      return res.render('register', { messages: ["Password does not match re-password!"] })
    } else {
      if (password.length < 8 || !(/^[a-z\d\-_]+$/.test(password))) {
        return res.render('register', { messages: ["Password must be at least 8 aplhanumeric chars in length."] })
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({
          username,
          password: hash
        })
        newUser.collection = []
        newUser.save((err) => {
          if (err) {
            const errMsg = newUser.validateSync().errors
            let messages = []
            if (errMsg.username) {
                console.log(errMsg.username.properties.message)
                messages.push(errMsg.username.properties.message)
            }
            return res.render('register', { messages: messages })
          } else {
            return res.redirect('/users/login')
          }
        })
      }
    }
  } else {
    res.render('register', { messages: ["Please fill in all fields!"] })
  }
})

// LOGOUT USER

router.get('/logout', function(req, res, next) {
  res.render('index');
})

module.exports = router;