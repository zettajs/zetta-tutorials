var Device = require('zetta').Device;
var util = require('util');

var StateMachineDevice = module.exports = function(name) {
     Device.call(this);
     this.assignedName = name;
    }

util.inherits(StateMachineDevice, Device);


StateMachineDevice.prototype.init = function(config) {
      
      // Set up the state machine 
      config
        .type('state_machine')
        .state('off')
        .name(this.assignedName);

      config
        // Define the transitions allowed by the state machine
        .when('off', {allow: ['turn-on']})
        .when('on', {allow: ['turn-off']})

        // Map the transitions to JavaScript methods
        .map('turn-off', this.turnOff)
        .map('turn-on', this.turnOn)
    }


    StateMachineDevice.prototype.turnOff = function(cb) {
      this.state = 'off';
      cb();
    }

    StateMachineDevice.prototype.turnOn = function(cb) {
      this.state = 'on';
      cb();
    }