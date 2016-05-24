## Introduction

In the last Zetta tutorial, you implemented a basic Scout class. In this tutorial, you will explore Zetta apps. Apps let you query for devices and create interactions between them in JavaScript.

When you complete this tutorial, you will know how to:

* Write a simple Zetta app
* Use the app to coordinate interaction between devices 
* Use the Zetta browser to test the app

![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/zetta-app.png)


## Before you begin

This tutorial builds on the previous tutorial. So, the best approach is to finish `scout` first, then jump to this tutorial.  

## Set up the project

We're going to begin by copying the completed code from the previous tutorial to a new project, and then you will proceed to modify that code.

1. Create a project directory. You can name it anything you wish. In this tutorial, call it `app`. 

2. Change to the `app` directory and do the following steps:

    a. Copy the `*.js` and `package.json` files from the `scout` directory (from the previous tutorial) into the new `app` directory. 

    b. Install the Node.js dependencies:

        `npm install zetta`


## Test the server

Start the server, same as you did in the previous tutorial:

`node index.js`

Be sure you see the same output in the terminal window as you did before. 

```
Jan-27-2016 12:34:00 [scout] Device (state_machine) f9920348-bf55-4c47-b1a9-1c2587620458 was discovered
Jan-27-2016 12:34:00 [scout] Device (state_machine) 45aa8603-f923-4271-9e89-dcd5684b0656 was discovered
Jan-27-2016 12:34:00 [scout] Device (state_machine) af55810b-8894-4d91-9af0-126cfdc8ad25 was discovered
```

## About the app

Your app will be designed to create interactions between multiple State Machine devices. When one State Machine is on, they all turn on. When one is turned off, they all turn off. 

## Begin coding the application

The first thing to do is take a look at the [reference documentation](https://github.com/zettajs/zetta/wiki/Apps) for the Zetta apps. 

1. In an editor, create a new file in the `app` directory and call it `app.js`. 

2. Copy the following code into the file. It queries for a device type, then waits until device(s) of that type come online.

  ```
    module.exports = function(server) {
     
      // Look up devices based on a property value
      var StateMachineQuery = server.where({type: 'state_machine'});
     
      // Wait for devices that fulfill the queries to come online
      server.observe([StateMachineQuery], function(state_machine) {
        console.log("State Machine came online");
      });
    }
  ```

  >Note: The code uses the where() method to form a query. The query specifies a name/value pair where the name is a device property and value is its value. The observe() method is a listener that waits until the queried device comes online, and then its callback is executed. 

3. Save the file. 


## Add the app to the server

1. Open the server file, `index.js` and make the following changes:

    a. Add the following require statement at the beginning of the file:

     `var StateMachineApp = require('./app.js');`

    b. On the Zetta server object, add `.use(StateMachineApp)`:

    ```
     zetta()
        .name('State Machine Server')
        .use(StateMachineScout)
        .use(StateMachineApp)
        .listen(1337, function(){
           console.log('Zetta is running at http://127.0.0.1:1337');
      });
    ```

## Test the app

Start the Zetta server: 

`node index.js`

The server output is shown below:

    ```
    Jan-28-2016 08:13:19 [server] Server (State Machine Server) State Machine Server listening on http://127.0.0.1:1337
    Zetta is running at http://127.0.0.1:1337
    Jan-28-2016 08:13:20 [scout] Device (state_machine) 6016e9e8-552d-404f-802b-41e487353962 was discovered
    State Machine came online
    Jan-28-2016 08:13:20 [scout] Device (state_machine) be7ea1de-f0b9-4738-9196-09ae5f99dbfd was discovered
    State Machine came online
    Jan-28-2016 08:13:20 [scout] Device (state_machine) 131cbb89-13a0-49c8-aba7-463917cd2789 was discovered
    State Machine came online
    ```

>Note: The console log statement is printed each time a device comes online.

## Quick review

At this point, you have the following Zetta components coded and working:

* Device -- Our device class models a state machine, where it is either on or off.
* Scout -- Our scout class is designed to wait one second, then discover three state machine devices. 
* App -- Our app module queries for devices of type state_machine, and listens for when they come online. When the appear, a callback function prints a message to the console. 
* Server -- The Zetta server uses all of these components. It generates REST APIs that allow users to interact with the devices. 

## Add a name property to the Device class

We need a way for the app to be able to distinguish between the multiple State Machine devices. To do this, you will add a name property to the StateMachineDevice object. 

1. Open the `device.js` file and make these changes:

    a. Pass a parameter to the device constructor, then set the property in the class:

     ```
       var StateMachineDevice = module.exports = function(name) {
         Device.call(this);
         this.assignedName = name;
       }
     ```

    b. Change the hard-coded name to the new name property that you added to the class:

    ```js
      config
          .type('state_machine')
          .state('off')
          .name(this.assignedName);
    ```

3. Open the `scout.js` file, and pass a name argument to each `discover()` function. 

 ```js
   StateMachineScout.prototype.init = function(next) {
      var self = this;
      setTimeout(function() {
        self.discover(StateMachine, 'machine_1');
        self.discover(StateMachine, 'machine_2');
        self.discover(StateMachine, 'machine_3');
      }, 1000);
      next();
    }
 ```

This code tells the function to pass the name to the constructor of each device when it is discovered and instantiated by Zetta.

## Modify the application to query for named devices

1. Open `app.js` and make the following changes:

  a. create a separate query for each device:

  ```js
      module.exports = function(server) {

        var StateMachine_1_Query = server.where({type: 'state_machine', name: 'machine_1'});
        var StateMachine_2_Query = server.where({type: 'state_machine', name: 'machine_2'});
        var StateMachine_3_Query = server.where({type: 'state_machine', name: 'machine_3'});
      }
  ```

  b. Tell Zetta to listen for when those devices appear online by implementing the observe() method, as follows:

  ```js
      module.exports = function(server) {

        var StateMachine_1_Query = server.where({type: 'state_machine', name: 'machine_1'});
        var StateMachine_2_Query = server.where({type: 'state_machine', name: 'machine_2'});
        var StateMachine_3_Query = server.where({type: 'state_machine', name: 'machine_3'});

        server.observe([StateMachine_1_Query, StateMachine_2_Query, StateMachine_3_Query], function(machine_1, machine_2, machine_3) {
        
          console.log("State Machine came online: " + machine_1.name + ", " + machine_2.name + ", " + machine_3.name);
        });
      }
  ```

  >Note: The observe() method can take an array of queries. This allows Zetta to wait for all three devices with the specified properties to come online. The callback will not fire if only machine 1 is online. It won't be called until all three are online. 

3. Start the server so that you can verify that the callback is called after all three devices have been discovered:

  ```
  Jan-28-2016 09:08:06 [server] Server (State Machine Server) State Machine Server listening on http://127.0.0.1:1337
  Zetta is running at http://127.0.0.1:1337
  Jan-28-2016 09:08:07 [scout] Device (state_machine) ff4b29a4-46ef-477f-aa9c-82e5f1c5f9d8 was discovered
  Jan-28-2016 09:08:07 [scout] Device (state_machine) 99f66c15-ebea-4ef5-87be-91f176805f9e was discovered
  Jan-28-2016 09:08:07 [scout] Device (state_machine) 80ab84be-afee-49f6-9bc8-4782151b24ab was discovered
  State Machine came online: machine_1, machine_2, machine_3
  ```

## Use the emitter pattern to connect the devices

The goal is to turn all the machines off when one is off, and turn all on when one is turned on. 

1. Open the `app.js` file and make the following change:

  a. Add the following function calls to the `observe()` method, below the `console.log()` call:

  ```
  machine_1.on('turn-off', function() {
    machine_2.call('turn-off');
    machine_3.call('turn-off');
  });

  machine_1.on('turn-on', function() {
    machine_2.call('turn-on');
    machine_3.call('turn-on');
  });
  ```

  >Note: This code is similar to the EventEmitter pattern in Node.js. In Zetta, state transitions are emitted as Node.js events on objects. So, when you call 'turn-off' on a device object, that transition is emitted as an event that you can capture and use to manipulate other devices. 

Here is the completed `app.js` code:

```
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
```


## Use the Zetta Browser to interact with the devices

Zetta has a browser client that you can simply point at an instance of the Zetta server, and interact with whatever devices are available. It's a great tool for running and debugging Zetta projects. 

It's simple to use. Open a browser and hit this URL (assuming your Zetta server is running locally on port 1337):

`http://browser.zettajs.io/#/overview?url=http:%2F%2F127.0.0.1:1337`

And you'll see this UI:

![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/zetta-browser.png)

You can click the buttons to interact with the devices (turn them on and off). And in the Zetta server terminal, you'll also see output indicating the state changes. 

>Note: Behind the scenes, this browser client is interacting directly with the Zetta REST APIs that you saw in the last tutorial. 

## Summary

In this topic, you wrote your first Zetta app. The app allowed you to coordinate interactions between devices. We added code to the app to query for named devices and change their state based on specified conditions. 





