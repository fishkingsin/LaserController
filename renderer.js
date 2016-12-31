// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SerialPort = require('serialport');
var port = null;
var portNames=[];
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
    portNames.push(port.comName);
    console.log(port.comName.indexOf('/dev/cu.usb'));
    // if(port == null && port.comName.indexOf('/dev/cu.usb')!=-1){
    //
    // }
  });
});

port = new SerialPort('/dev/cu.usbmodem1411', {
   parser: SerialPort.parsers.readline('\n')
});
port.on('open', function() {
  // port.write('main screen turn on', function(err) {
  //   if (err) {
  //     return console.log('Error on write: ', err.message);
  //   }
  //   console.log('message written');
  // });
  var portNamecontroller = gui.add(serialData, 'portNames', portNames);
  portNamecontroller.onFinishChange(function (data){
    console.log(data);
  });
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})
port.on('data', function(data) {
  console.log('data: ', data);
})

var SerialData = function() {
  this.servo1 = 0;
  this.servo2 = 0;
  this.laser = 0;
  this.sendOnChange = false;
  this.portNames = [];
  this.senddata = function() {
    sendData();
  };
};
function sendData(){
  console.log(JSON.stringify(serialData));
  port.write(JSON.stringify(serialData), function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
}
var gui = new dat.GUI({ autoPlace: false, load: JSON, preset:'/dev/cu.usbmodem1411' });
var serialData = new SerialData();
gui.remember(serialData);
window.onload = function() {



  var customContainer = document.getElementById('my-gui-container');
  customContainer.appendChild(gui.domElement);

  var servo1Controller = gui.add(serialData, 'servo1', parseInt(0), parseInt(180));
  var servo2Controller = gui.add(serialData, 'servo2', parseInt(0), parseInt(180));
  var laserController = gui.add(serialData, 'laser' , parseInt(0), parseInt(180));

  gui.add(serialData, 'sendOnChange');
  gui.add(serialData, 'senddata');

  servo1Controller.onFinishChange(onFinishedChange);
  servo2Controller.onFinishChange(onFinishedChange);
  laserController.onFinishChange(onFinishedChange);
};

var onFinishedChange = function(value) {
  // Fires when a controller loses focus.
  if(serialData.sendOnChange){
    sendData();
  }
}
