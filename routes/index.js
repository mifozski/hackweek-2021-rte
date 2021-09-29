var express = require('express');
var initEvernoteProvider = require('../evernote-connector');
var router = express.Router();

const sessionMap = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/rteCallback', function(req, res, next) {
  console.error(req.body.room)

  const sessionId = req.body && req.body.room;
  if (sessionId && sessionMap[sessionId] && session.client && session.noteGuid) {
    const session = sessionMap[sessionId];

    var noteStore = session.client.getNoteStore();

    // noteStore.updateNote({
    //   guid: session.noteGuid,
    //   title: 'HELLO FROM ANDREY - ' + Date.now().toString(),
    // }).then(data => {
    //   console.log(data)
    // }).catch(e => {
    //   console.error('error in updateNote: ', e)
    // })
  }

  res.end();
});

router.post('/creds', function(req, res, next) {
  console.error('body', req.body)

  const { authToken, noteGuid } = req.body;

  const sessionId = `${noteGuid}-${authToken}`;
  
  console.error(sessionId)

  res.setHeader('Content-Type', 'application/json');

  if (sessionMap[sessionId]) {
    console.error('existing sessionID', sessionId)
    return res.end(sessionId);
  }
  
  const enProvider = initEvernoteProvider(authToken);
  
  sessionMap[sessionId] = {
    noteGuid: noteGuid,
    authToken: authToken,
    client: enProvider,
  };

  console.error('new sessionID', sessionId)
  return res.end(sessionId);
});

module.exports = router;
