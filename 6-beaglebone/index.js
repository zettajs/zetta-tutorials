var zetta = require('zetta');
var BeagleBoneLedDevice = require('./device.js');

  zetta()
    .name('BeagleBone LED')
    // construct the object with the listed arguments
    .use(BeagleBoneLedScout, 'USR1')
    .listen(1337, function(){
       console.log('Zetta is running at http://127.0.0.1:1337');
  });
