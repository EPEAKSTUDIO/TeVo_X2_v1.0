// testing for the thermocouple reading on TeVo X2 v1.0

var max31855pi = require('max31855pi')
var listener = max31855pi({ cs: 22, so: 9, sck: 11 })  // Needs to be updated to the right values for TeVo

listener.on('temperature', function (temp) {
  console.log('Current temp =', temp, 'C')
})

listener.start()
