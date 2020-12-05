var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('<h1>Snake Game\'s Backend server</h1></br>Find the list of running games at /api');
});

module.exports = router;
