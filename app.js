// Use module from local version for the time being
var max31855 = require('./max31855');

//AUTOBAHN_DEBUG = true;
var https = require('https');
https.globalAgent.options.rejectUnauthorized = false;
var autobahn = require('autobahn');
// var deviceConfig = require('./device-config'); // Not sure how to do all the proper connection in node between files...
/*autobahn configuration*/
var device_key = process.env.DEVICE_KEY;
var connection = new autobahn.Connection({
    url: 'wss://ingest.epeakgears.com:1337/ws',
    realm: process.env.API_KEY
});

// ROG_EXT
var i2c = require('i2c-bus'),
    i2c1;
//var rog_ext = require('./rog_ext.js');  // Not sure how to do all the proper connection in node between files...

function pad(n, width, z) {
  z = z || '0';
  n = n.toString(16) + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// Change endiannes / swap two bytes of a word
function swap16(val) {
  return ((val & 0xFF) << 8) | ((val >> 8) & 0xFF);
}
function toClk(rawValue) {
  return swap16(rawValue) * 0.1;
}
// Volts conversion
function toVolts(rawValue) {
  return swap16(rawValue) * 0.005;
}
// Fan RPM conversion
function toRPM(rawValue) {
  return swap16(rawValue);
}


// Defining all the stuff that needs to be defined
/* thermocouples */
const thermocouple1 = new max31855(0, 0);
const thermocouple2 = new max31855(0, 1);
/* ROG_EXT I2C Device address */
var  ROGEXT_ADDR = 0x4a;
/* ROG_EXT Command codes */
var CMD_OPEID_READ = 0x00,
    CMD_BOOT_CODE_READ = 0x10,
    CMD_CPU_RATIO_READ = 0x20,
    CMD_CACHE_RATIO_READ = 0x24,
    CMD_BCLK_READ = 0x28,
    CMD_V1_READ = 0x30,
    CMD_V2_READ = 0x38,
    CMD_VCORE_READ = 0x40,
    CMD_DRAM_VOLTAGE_READ = 0x48,
    CMD_CPU_TEMPERATURE_READ = 0x50,
    CMD_FAN_SPEED_READ = 0x60;
/*device sensor configuration - sent to overlay.live*/
var gimmeSensorz = function() {
    return {
	sensors:[
    {
      channel: 'sensorA', // [*] The channel the sensor will publish data
      name: 'Temperature 1', // [*] The default sensor name
      unit: 'C', // The sensor type (temperature, voltage, etc)
      type: 'Temperature',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'RaspberryPi HAT v1.0' // Additional hardware informations
    },
    {
      channel: 'sensorB', // [*] The channel the sensor will publish data
      name: 'Temperature 2', // [*] The default sensor name
      unit: 'C', // The sensor type (temperature, voltage, etc)
      type: 'Temperature',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'RaspberryPi HAT v1.0' // Additional hardware informations
    },
    {
  		channel: 'sensor1', // [*] The channel the sensor will publish data
  		name: 'Boot Code', // [*] The default sensor name
  		unit: 'Code', // The sensor type (temperature, voltage, etc)
      type: 'Code',
  		manufacturer: 'Elmor Labs', // The sensor manufacturer
  		version: '1.0', // The sensor version
  		hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor2', // [*] The channel the sensor will publish data
  		name: 'CPU Ratio', // [*] The default sensor name
  		unit: 'x', // The sensor type (temperature, voltage, etc)
      type: 'Multiplier',
  		manufacturer: 'Elmor Labs', // The sensor manufacturer
  		version: '1.0', // The sensor version
  		hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor3', // [*] The channel the sensor will publish data
      name: 'CPU Cache Ratio', // [*] The default sensor name
      unit: 'x', // The sensor type (temperature, voltage, etc)
      type: 'Multiplier',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor4', // [*] The channel the sensor will publish data
      name: 'BCLK', // [*] The default sensor name
      unit: 'MHz', // The sensor type (temperature, voltage, etc)
      type: 'Clock',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor4b', // [*] The channel the sensor will publish data
      name: 'CPU Frequency', // [*] The default sensor name
      unit: 'GHz', // The sensor type (temperature, voltage, etc)
      type: 'Frequency',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor5', // [*] The channel the sensor will publish data
      name: 'V1', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor6', // [*] The channel the sensor will publish data
      name: 'V2', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor7', // [*] The channel the sensor will publish data
      name: 'VCore', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor8', // [*] The channel the sensor will publish data
      name: 'DRAM Voltage', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor9', // [*] The channel the sensor will publish data
      name: 'CPU Temp', // [*] The default sensor name
      unit: 'C', // The sensor type (temperature, voltage, etc)
      type: 'Temperature',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    },
    {
      channel: 'sensor10', // [*] The channel the sensor will publish data
      name: 'CPU Fan Speed', // [*] The default sensor name
      unit: 'rpm', // The sensor type (temperature, voltage, etc)
      type: 'Speed',
      manufacturer: 'Elmor Labs', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: '1.0' // Additional hardware informations
    }
	]
    };
}





/* Totally have to clean this up and make the proper test to see if the ROG_EXT is even connected.
/* This is just a quick test to make sure it works for the demo
*/

var start = function() {
    console.log('About to read');

      var hello = setInterval(function(){

      console.log('Reading all Settings:');

       thermocouple1.readTempC(function(temp) {
           console.log('TC1 - Temp in ℃    : ', temp);
           var uriSensorA = device_key + '.sensorA';
           autosession.publish(uriSensorA, [{data:temp}]);
       });
       thermocouple1.readInternalC(function(temp) {
           console.log('TC1 - Internal in ℃: ', temp);
       });

       thermocouple2.readTempC(function(temp) {
           console.log('TC2 - Temp in ℃    : ', temp);
           var uriSensorB = device_key + '.sensorB';
           autosession.publish(uriSensorB, [{data:temp}]);
       });
       thermocouple2.readInternalC(function(temp) {
           console.log('TC2 - Internal in ℃: ', temp);
       });

       console.log('------')

       i2c1 = i2c.open(1, function (err) {
         if (err) throw err;
         console.log('About to read i2c');
         opeId = i2c1.readByte(ROGEXT_ADDR, CMD_OPEID_READ, function(err){
           if (err) {
             console.log('NO ROG EXT DETECTED');
             console.log('------');
             // Do nothing.
           }
           else {
             console.log('ROG EXT DETECTED');
             console.log('------');
             // Code here to read I2C from ROG_EXT

             bootCode = i2c1.readByteSync(ROGEXT_ADDR, CMD_BOOT_CODE_READ);
             console.log('Boot code     : ' + bootCode.toString(16));
             var uriSensor1 = device_key + '.sensor1';
             var bootcode_conv = bootCode.toString(16);
             autosession.publish(uriSensor1, [{data:bootcode_conv}]);

             cpuRatio = i2c1.readByteSync(ROGEXT_ADDR, CMD_CPU_RATIO_READ);
             console.log('CPU ratio     : ' + cpuRatio);
             var uriSensor2 = device_key + '.sensor2';
             autosession.publish(uriSensor2, [{data:cpuRatio}]);

             cacheRatio = i2c1.readByteSync(ROGEXT_ADDR, CMD_CACHE_RATIO_READ);
             console.log('Cache ratio   : ' + cacheRatio);
             var uriSensor3 = device_key + '.sensor3';
             autosession.publish(uriSensor3, [{data:cacheRatio}]);

             rawBclk = i2c1.readWordSync(ROGEXT_ADDR, CMD_BCLK_READ);
             console.log('BCLK:         : ' + toClk(rawBclk) + ' (raw: ' + rawBclk + '/ 0x' + pad(rawBclk, 4) + ')');
             var uriSensor4 = device_key + '.sensor4';
             var Bclk = toClk(rawBclk);
             autosession.publish(uriSensor4, [{data:Bclk}]);

             // Adding some calculated value for CPU Frequency. BLCK*CMD_CPU_RATIO_READ
             cpuFrequency = cpuRatio*Bclk*0.001;
             console.log('CPU Frequency : ' + cpuFrequency.toFixed(3) +' (calculated)');
             var uriSensor4b = device_key + '.sensor4b';
             var cpuFrequency_round = cpuFrequency.toFixed(3);
             autosession.publish(uriSensor4b, [{data:cpuFrequency_round}]);

             rawV1 = i2c1.readWordSync(ROGEXT_ADDR, CMD_V1_READ);
             console.log('V1            : ' + toVolts(rawV1).toFixed(3) + ' V (raw: ' + rawV1 + '/ 0x' + pad(rawV1, 4) + ')');
             var uriSensor5 = device_key + '.sensor5';
             var v1 = toVolts(rawV1).toFixed(3);
             autosession.publish(uriSensor5, [{data:v1}]);

             rawV2 = i2c1.readWordSync(ROGEXT_ADDR, CMD_V2_READ);
             console.log('V2            : ' + toVolts(rawV2).toFixed(3) + ' V (raw: ' + rawV2 + '/ 0x' + pad(rawV2, 4) + ')');
             var uriSensor6 = device_key + '.sensor6';
             var v2 = toVolts(rawV2).toFixed(3);
             autosession.publish(uriSensor6, [{data:v2}]);

             rawVcore = i2c1.readWordSync(ROGEXT_ADDR, CMD_VCORE_READ);
             console.log('VCORE         : ' + toVolts(rawVcore).toFixed(3) + ' V (raw: ' + rawVcore + '/ 0x' + pad(rawVcore, 4) + ')');
             var uriSensor7 = device_key + '.sensor7';
             var vCore = toVolts(rawVcore).toFixed(3);
             autosession.publish(uriSensor7, [{data:vCore}]);

             rawDram = i2c1.readWordSync(ROGEXT_ADDR, CMD_DRAM_VOLTAGE_READ);
             console.log('DRAM          : ' + toVolts(rawDram).toFixed(3) + ' V (raw: ' + rawDram + '/ 0x' + pad(rawDram, 4) + ')');
             var uriSensor8 = device_key + '.sensor8';
             var vDram = toVolts(rawDram).toFixed(3);
             autosession.publish(uriSensor8, [{data:vDram}]);

             cpuTemp = i2c1.readByteSync(ROGEXT_ADDR, CMD_CPU_TEMPERATURE_READ);
             console.log('CPU temp      : ' + cpuTemp + ' degC');
             var uriSensor9 = device_key + '.sensor9';
             autosession.publish(uriSensor9, [{data:cpuTemp}]);

             rawFan = i2c1.readWordSync(ROGEXT_ADDR, CMD_FAN_SPEED_READ);
             console.log('Fan           : ' + toRPM(rawFan) + ' RPM (raw: ' + rawFan + '/ 0x' + pad(rawFan, 4) + ')');
             var uriSensor10 = device_key + '.sensor10';
             var FanRPM = toRPM(rawFan);
             autosession.publish(uriSensor10, [{data:FanRPM}]);

             console.log('');

           }});
        });
        i2c1.closeSync();

       },
       1000);
};



/*Opening connection with Overlay.live server*/
connection.onopen = function (session) {
  console.log("Connected to network with Session ID: "+session.id);

    /*Registering the device sensors // Updating save configuratin*/
    var uriRegister = device_key + '.proc_list_sensors';
    session.register(uriRegister, gimmeSensorz).then(function(reg){

    autosession = session;
    console.log("procedure registered");
    start();

   }, function(err) {
  console.log("failed to register procedure: " + err.error);
   });
};

connection.onclose = function (reason, details) {
    console.log(reason);
};

connection.open();
