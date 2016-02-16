var zetta = require('zetta');
var StateMachineScout = require('./scout.js');

  zetta()
    .name('State Machine Server')
    .use(StateMachineScout)
    .listen(1337, function(){
       console.log('Zetta is running at http://127.0.0.1:1337');
  });
