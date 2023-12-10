var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

module.exports = router;
