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

  const noteGuid = req.body && req.body.room;

  console.log('noteGuid:', noteGuid)
  console.log('sessionMap:', sessionMap)
  
  if (noteGuid && sessionMap[noteGuid] && sessionMap[noteGuid].client) {
    const session = sessionMap[noteGuid];

    console.log('updating title for ', noteGuid)

    var noteStore = session.client.getNoteStore();

    noteStore.updateNote({
      guid: noteGuid,
      title: 'HELLO FROM ANDREY - ' + Date.now().toLocaleDateString(),
    }).then(data => {
      console.log(data)
    }).catch(e => {
      console.error('error in updateNote: ', e)
    })
  }

  res.end();
});

router.post('/creds', function(req, res, next) {
  console.error('body', req.body)

  const { authToken, noteGuid } = req.body;

  const sessionId = `${noteGuid}/${authToken}`;
  
  console.error(sessionId)

  res.setHeader('Content-Type', 'application/json');

  if (sessionMap[noteGuid]) {
    console.error('existing sessionID', sessionId)
    return res.end(sessionMap[noteGuid].sessionId);
  }
  
  const enProvider = initEvernoteProvider(authToken);
  
  sessionMap[noteGuid] = {
    noteGuid: noteGuid,
    sessionId: sessionId,
    authToken: authToken,
    client: enProvider,
  };

  console.error('new sessionID', sessionId)
  return res.end(noteGuid);
});

module.exports = router;
