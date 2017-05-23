/*autobahn configuration*/
var device_key = process.env.DEVICE_KEY;
var connection = new autobahn.Connection({
    url: 'wss://ingest.epeakgears.com:1337/ws',
    realm: process.env.API_KEY
});

/*device sensor configuration - sent to overlay.live*/
var gimmeSensorz = function() {
    return {
	sensors:[
    {
  		channel: 'sensor1', // [*] The channel the sensor will publish data
  		name: 'Boot Code', // [*] The default sensor name
  		unit: 'Code', // The sensor type (temperature, voltage, etc)
      type: 'Code',
  		manufacturer: 'Epeak Gears', // The sensor manufacturer
  		version: '1.0', // The sensor version
  		hardware: 'prototype v0.01' // Additional hardware informations
    },
    {
      channel: 'sensor2', // [*] The channel the sensor will publish data
  		name: 'CPU Ratio', // [*] The default sensor name
  		unit: 'x', // The sensor type (temperature, voltage, etc)
      type: 'Multiplier',
  		manufacturer: 'Epeak Gears', // The sensor manufacturer
  		version: '1.0', // The sensor version
  		hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor3', // [*] The channel the sensor will publish data
      name: 'CPU Cache Ratio', // [*] The default sensor name
      unit: 'x', // The sensor type (temperature, voltage, etc)
      type: 'Multiplier',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor4', // [*] The channel the sensor will publish data
      name: 'BCLK', // [*] The default sensor name
      unit: 'MHz', // The sensor type (temperature, voltage, etc)
      type: 'Clock',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor5', // [*] The channel the sensor will publish data
      name: 'V1', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor6', // [*] The channel the sensor will publish data
      name: 'V2', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor7', // [*] The channel the sensor will publish data
      name: 'VCore', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor8', // [*] The channel the sensor will publish data
      name: 'DRAM Voltage', // [*] The default sensor name
      unit: 'V', // The sensor type (temperature, voltage, etc)
      type: 'Voltage',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor9', // [*] The channel the sensor will publish data
      name: 'CPU Temp', // [*] The default sensor name
      unit: 'C', // The sensor type (temperature, voltage, etc)
      type: 'Temperature',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    },
    {
      channel: 'sensor10', // [*] The channel the sensor will publish data
      name: 'CPU Fan Speed', // [*] The default sensor name
      unit: 'rpm', // The sensor type (temperature, voltage, etc)
      type: 'Speed',
      manufacturer: 'Epeak Gears', // The sensor manufacturer
      version: '1.0', // The sensor version
      hardware: 'prototype v1.0' // Additional hardware informations
    }
	]
    };
}
