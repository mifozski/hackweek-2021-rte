var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/rteCallback', function(req, res, next) {
  console.error(req)
});

module.exports = router;
