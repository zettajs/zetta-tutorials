

module.exports = function(server) {

	var StateMachine_1_Query = server.where({type: 'state_machine', name: 'machine_1'});
	var StateMachine_2_Query = server.where({type: 'state_machine', name: 'machine_2'});
	var StateMachine_3_Query = server.where({type: 'state_machine', name: 'machine_3'});

	server.observe([StateMachine_1_Query, StateMachine_2_Query, StateMachine_3_Query], function(machine_1, machine_2, machine_3) {
		console.log("State Machine came online: " + machine_1.name + ", " + machine_2.name + ", " + machine_3.name);

        machine_1.on('turn-off', function() {
        	machine_2.call('turn-off');
        	machine_3.call('turn-off');
        });

        machine_1.on('turn-on', function() {
        	machine_2.call('turn-on');
        	machine_3.call('turn-on');
        });
	});
}