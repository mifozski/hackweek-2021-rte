var express = require('express');
var router = express.Router();

var initEvernoteProvider = require('../evernote-connector');

/* GET users listing. */
router.get('/', function(req, res, next) {

  var client = initEvernoteProvider('S=s2:U=4656cd:E=17c9e5abc34:C=17c03dbf434:P=5fd:A=en-web:V=2:H=f28a14b12d576d219977a71ecc3f1cc1');
  
  res.send(JSON.stringify(client));
});

module.exports = router;
