var zetta = require('zetta');
var StateMachineScout = require('./scout.js');
var StateMachineApp = require('./app.js');
var Screen = require('./screen.js');

  zetta()
    .name('State Machine Server')
    .use(StateMachineScout)
    .use(Screen)
    .use(StateMachineApp)
    .listen(1337, function(){
       console.log('Zetta is running at http://127.0.0.1:1337');
  });
