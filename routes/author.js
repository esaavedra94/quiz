var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('author', { title: 'Autores de Quiz Edav', errors: [] });
});

module.exports = router;
