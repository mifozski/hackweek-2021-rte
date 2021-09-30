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
  
  if (noteGuid && sessionMap[noteGuid] && sessionMap[noteGuid].client) {
    const session = sessionMap[noteGuid];
    const xmlContent = req.body && req.body.data && req.body.data.prosemirror && req.body.data.prosemirror.content;
    const enml = xmlToEnmlConverter(xmlContent || '');

    console.error('enml --> ', enml);

    console.log('updating title for ', noteGuid);

    var noteStore = session.client.getNoteStore();

    noteStore.updateNote({
      guid: noteGuid,
      title: 'HELLO FROM ANDREY - ' + Date.now().toLocaleDateString(),
      content: enml
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

  res.setHeader('Content-Type', 'application/json');

  if (sessionMap[noteGuid]) {
    console.error('existing sessionID', noteGuid)
    return res.end(noteGuid);
  }
  
  const enProvider = initEvernoteProvider(authToken);
  
  sessionMap[noteGuid] = {
    noteGuid: noteGuid,
    authToken: authToken,
    client: enProvider,
  };

  console.error('new sessionID', noteGuid)
  return res.end(noteGuid);
});

function xmlToEnmlConverter(xmlString) {
  const enmlDocType = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';

  let enml = xmlString.replace(/(<paragraph)/igm, '<div').replace(/<\/paragraph>/igm, '</div>');
  enml = enml.replace(/(<strong)/igm, '<b').replace(/<\/strong>/igm, '</b>');
  enml = enml.replace(/(<em)/igm, '<i').replace(/<\/em>/igm, '</i>');

  return `${enmlDocType}<en-note>${enml}</en-note>`;
}

module.exports = router;
