const express = require('express');
const router = express.Router();

// GET HOME PAGE

router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;