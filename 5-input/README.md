## Introduction

In the last Zetta tutorial, you developed an app to create interactions between devices. 

In this tutorial, you will write a Device class that can accept user input and stream the input to transition functions. 

When you complete this tutorial, you will know how to:

* Write a Device class that allows input to be provided to transition functions
* Use the Zetta browser to test the code

![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/zetta-scout.png)

## Before you begin

This tutorial builds on the previous tutorial. The best approach is to finish the Zetta app tutorial first, then jump to this tutorial.  

## Set up the project

We're going to begin by copying the completed code from the previous tutorial to a new project, and then you will proceed to modify that code.

1. Create a project directory. You can name it anything you wish. In this tutorial, call it `input`. 

2. Change to the `input` directory and follow these steps:

    a. Copy the `*.js` and `package.json` files from the `app` directory (from the previous tutorial) into the new `input` directory. 

    b. Install the Node.js dependencies:

        `npm install zetta`

## Test the server

Start the server, same as you did in the previous tutorial:

`node index.js`

Be sure you see the same output in the terminal window as you did before:

```
Jan-28-2016 09:08:06 [server] Server (State Machine Server) State Machine Server listening on http://127.0.0.1:1337
Zetta is running at http://127.0.0.1:1337
Jan-28-2016 09:08:07 [scout] Device (state_machine) ff4b29a4-46ef-477f-aa9c-82e5f1c5f9d8 was discovered
Jan-28-2016 09:08:07 [scout] Device (state_machine) 99f66c15-ebea-4ef5-87be-91f176805f9e was discovered
Jan-28-2016 09:08:07 [scout] Device (state_machine) 80ab84be-afee-49f6-9bc8-4782151b24ab was discovered
State Machine came online: machine_1, machine_2, machine_3
```

## About the Device class

You will create a new Device class called Screen. You'll be familiar with the basic structure of the class from previous tutorials. However, in this tutorial you will take advantage of a couple of features you haven't seen yet.

* First, you will provide a third argument to the `map()` function. This argument allows you to pass input to the transition function. The argument is an object with two properties: `type` and `name`. 

* Second, you will use the `Device.monitor()` method. This method streams a property from your device instance out of Zetta. Zetta monitors the property for changes, and if they occur it will publish an event down the stream.

## Device code

You may want to take a look at the [reference documentation](https://github.com/zettajs/zetta/wiki/Device) for the Zetta Device class. There, you'll find information on the `map()` and `monitor()` methods. 

1. In an editor, open a file and call it `screen.js`. 

2. Copy the following code into the file. For the most part, it should look familiar. This is the standard pattern for creating Device classes: 

  ```js
    // screen.js

    Device = require('zetta').Device;
    var util = require('util');

    // Set up Screen class
    var Screen = module.exports = function() {
      Device.call(this);
    }

    util.inherits(Screen, Device);

    Screen.prototype.init = function(config) {

      // Class metadata
      config
        .type('screen')
        .name('state_machine_screen')
        .state('ready');

      // Set up state machine
      config
        .when('ready', { allow: ['write'] })
        .map('write', this.write, [{ type: 'text', name: 'textToWrite' }])
        .monitor('written');
    }

    Screen.prototype.write = function(textToWrite, cb) {
      this.written = textToWrite;
      cb();
    }
  ```

3. Save the file. 


## Add the Device to the server

As you've seen in previous tutorials, you have to make Zetta aware of the new device. Here, you'll add it to the Zetta server with the `use()` method. 

1. Open the server file, `index.js` and make these changes:

    a. Add the following require statement at the beginning of the file:

     `var Screen = require('./screen.js');`

    b. On the Zetta server object, add `.use(Screen)`:

    ```
     zetta()
        .name('State Machine Server')
        .use(StateMachineScout)
        .use(Screen)
        .use(StateMachineApp)
        .listen(1337, function(){
           console.log('Zetta is running at http://127.0.0.1:1337');
      });
    ```

## Test the device

Make sure there are no errors in the code by starting the Zetta server. If there are errors, correct them and try starting again. 

`node index.js`

## Use the Zetta Browser to interact with the new device

Open a browser and hit this URL for the Zetta browser (assuming your Zetta server is running locally on port 1337):

`http://browser.zettajs.io/#/overview?url=http:%2F%2F127.0.0.1:1337`

You'll see the **state_machine_screen** UI. 

1. Enter some text in the input field:

  ![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/zetta-write-1.png)

2. Click the **Write** button, and the text is written to the screen output.

  ![Zetta Server](https://github.com/WWitman/zettajs-tutorials/blob/master/images/zetta-write-2.png)

>Note: In the Zetta server terminal, you'll also see output indicating the state changes. 

## Summary

In this topic, you created a Device class that accepts user input and streams it out to clients. 





