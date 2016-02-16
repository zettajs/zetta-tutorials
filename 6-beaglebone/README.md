## Introduction

Up to now, you have used Zetta to generate APIs for "fake" devices -- essentially, state machines that exist in memory only.

In this tutorial, you will use Zetta to turn a physical LED attached to a [BeagleBone Black](http://beagleboard.org/black) on and off. It's pretty simple to do, and most of the code will be nearly identical to the state machine code you wrote in the previous tutorials. 

When you complete this tutorial, you will know how to:

* Write a Device class that turns an LED attached to a BeagleBone Black on and off
* Use BeagleBone-specific Node.js module called BoneScript
* Use the Zetta browser to test the code

![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/beaglebone-usr1.png)

## Prerequisites for this tutorial

To run the code in this tutorial, you must have a [BeagleBone Black](http://beagleboard.org/BLACK) device running and configured with your laptop or on your network. We use the built-in Cloud9 IDE for BeagleBone to develop the project. BoneScript is also built-in to the BeagleBone, so there's no need for you to do `npm install` to get the BoneScript module. 

![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/cloud9.png)

In this tutorial, you will blink one of the on-board LEDs on the BeagleBone. In the next tutorial, you will work with multiple external devices. 

You can find complete instructions for setting up this project on the BeagleBoard website. It's a good idea to set up and test out the example projects before integrating the code with Zetta. 

* [Blink an on-board LED](http://beagleboard.org/Support/BoneScript/demo_blinkled/)

As with all Zetta projects, this one gives you a REST API that you can use to interact with the device over the internet: blink an on-board LED on and off. 

## Create the Zetta project

We're going to set up and run this project on the BeagleBone itself. To do this, you can use the Cloud9 IDE, or develop using a remote login shell. 

1. Open the [Cloud9 IDE](http://beagleboard.org/Support/bone101/#cloud9) or a remote login shell on the BeagleBone device. 

1. Create a project directory on the BeagleBone called: `beaglebone`. 

2. Change directory to `beaglebone` and do these steps:

    a. Execute this command to create a new Node.js project: 

    `npm init`

    b. Hit return several times to accept all the defaults. This step creates a `package.json` file, which contains meta information about the project and its dependencies. 

    c. Install the `zetta` Node.js module. The `--save` option adds `zetta` to the `package.json` dependencies list. 

    `npm install zetta --save`

You now have a bare-bones Zetta project containing a `node_modules` directory and a `package.json` file. Next, you will set up the Zetta server.


## Set up the Zetta server

Set up the Zetta server and run it locally. 

1. If the Zetta server is still running (from when you tried the last tutorial), stop the server with `Control-c`. 

2. In the `beaglebone` directory create a new file called `index.js`, and copy this code into it:

  ```js
  var zetta = require('zetta');

  zetta()
    .name('Zetta Server on BeagleBone Hub')
    .listen(1337, function(){
       console.log('Zetta is running at http://127.0.0.1:1337');
  });
  ```

4. Save the file.

You now have a minimally configured Zetta server. 

## Test the server

In the `beaglebone` directory, enter this command to make sure there are no errors in the server code:

`node index.js`

You'll see output like the following. 

```
Feb-01-2016 15:18:36 [server] Server (Zetta Server on BeagleBone Hub) Zetta Server on BeagleBone Hub listening on http://127.0.0.1:1337
Zetta is running at http://127.0.0.1:1337
```

The output confirms that the server is running on port 1337 and tells you the name of the server (Zetta Server).

## About the Device class

For this simple example, you will create a basic Device class. The code will be almost identical to the `state-machine` tutorial. 

In the Device class, you will define state tranisitions, and map them to JavaScript methods, much like you did with the state machine tutorials.  

To communicate with the BeagleBone board via JavaScript, you must require the [BoneScript](http://beagleboard.org/Support/BoneScript/) Node.js library. BoneScript lets you interact with pins on the board, change their states, and so on. 

## Implement the Device

In this section, you will implement the Device class that enables Zetta to talk to the BeagleBone Black device. 

1. If you're not there, change directory to the `beaglebone` directory. 

2. Create a new file `device.js` and follow these steps:

    a. Open the file in an editor.

    b. Require these libraries:

    ```
    var Device = require('zetta').Device;
    var util = require('util');
    var bone = require('bonescript');
    ```

    c. Here's the Device class constructor. We pass a `pin` property to the constructor. As you will see, the value of the property is passed as an argument to the `Zetta.use()` function in the Zetta server. 

    ```
    var BeagleBoneLedDevice = module.exports = function(pin) {
       this.assignedPin = pin;
       Device.call(this);
    }
    util.inherits(BeagleBoneLedDevice, Device);
    ```

    d. Implement the `init()` function. Note that up until now, there's no device-specific code. This code is almost the same as the code you wrote in previous tutorials.

    ```
    BeagleBoneLedDevice.prototype.init = function(config) {
      
      // Set up the state machine 
      config
        .type('beaglebone_led')
        .state('off')
        .name("BeagleBone LED Device: " + this.assignedPin);

      // Define the transitions allowed by the state machine
      config
        .when('off', {allow: ['turn-on']})
        .when('on', {allow: ['turn-off']})

        // Map the transitions to JavaScript methods
        .map('turn-off', this.turnOff)
        .map('turn-on', this.turnOn)
    }
    ```

    e. Implement the state machine transition methods. Now, you will start using the BoneScript library to interact with the device. 

    ```
     BeagleBoneLedDevice.prototype.turnOff = function(cb) {
      this.state = 'off';
      bone.digitalWrite(this.assignedPin, 0);
      cb();
    }

    BeagleBoneLedDevice.prototype.turnOn = function(cb) {
      this.state = 'on';
      bone.digitalWrite(this.assignedPin, 1);
      cb();
    }
    ```

8. Save the device file. 

## Add the device to the server

Now, you need to make the Zetta server aware of the device. This pattern should be familiar to you if you tried the previous tutorials.

1. Open the server file, `index.js` and make the following changes:
    
    a. Require the device module you just implemented:

    ```
    var zetta = require('zetta');
    var BeagleBoneLedDevice = require('./device.js');
    ```

    b. Call the `use()` method on the Zetta server, as follows. The first argument is the Device class you implemented. The second argument is passed to the device constructor when Zetta instantiates the device. 

    ```
     zetta()
        .name('Zetta Server')
        .use(BeagleBoneLedDevice, 'USR1')
        .listen(1337, function(){
           console.log('Zetta is running at http://127.0.0.1:1337');
      });
    ```

4. Save the file.

## Test the project

Now, you can start the Zetta server and test the device using the Zetta browser. 

1. Start the Zetta server: 

  `node index.js`

2. The server output should look like this: 

  ```
  node index.js
  Jan-22-2016 15:34:18 [scout] Device (beaglebone_led) 7cbf5759-4106-4985-83aa-e970fe13490d was discovered
  Jan-22-2016 15:34:18 [server] Server (Zetta Server on BeagleBone Hub)) Zetta Server on BeagleBone Hub) listening on http://127.0.0.1:1337
  Zetta is running at http://127.0.0.1:1337
  ```

  >Note: The `beaglebone_led` device was discovered. This means that Zetta found the device and has generated APIs for it. 

3. Open a browser and enter this URL (assuming your Zetta server is running on the BeagleBone on port 1337):

  `http://browser.zettajs.io/#/overview?url=http:%2F%2Fbeaglebone.local:1337`

4. In the UI, toggle the **beaglebone_led** on and off. 

  ![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/led-device-browser.png)

## Summary

In this topic, you created a Zetta project that communicates with a BeagleBone Black embedded Linux device. APIs generated by Zetta allow you to interact with the device through the Internet. 





