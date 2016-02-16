var Scout = require('zetta').Scout;
var util = require('util');
var StateMachine = require('./device.js');

StateMachineScout = module.exports = function() {

	Scout.call(this);
}

util.inherits(StateMachineScout, Scout);

StateMachineScout.prototype.init = function(next) {
    var self = this;

    setTimeout(function() {
    	self.discover(StateMachine, 'machine_1');
    	self.discover(StateMachine, 'machine_2');
    	self.discover(StateMachine, 'machine_3');
    }, 1000);

    next();

}