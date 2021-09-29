var Evernote = require('evernote');

function initEvernoteProvider(token) {
  var client = null;

  try {
    client = new Evernote.Client({
      token,
      serviceHost: 'stage.evernote.com',
    });

    var userStore = client.getUserStore();
    
    userStore.getUser().then(function(user) {
        console.log(user)
    }).catch(e => {
      console.error('error in getUser: ', e)
    });
  } catch (e) {
    console.error('error in creating evernote client: ', e)
  }
    
  return client;
}

module.exports = initEvernoteProvider;
