// testing for the thermocouple reading on TeVo X2 v1.0


// For reference, TeVo has 2 MAX31855 chips.
// #1
// CLK = GPIO11
// MSIO = GPIO09
// CE = GPIO08
//#2
// CLK = GPIO11
// MSIO = GPIO09
// CE = GPIO07

var max31855pi = require('max31855pi')
var temp1 = max31855pi({ cs: 8, so: 9, sck: 11 })  //

temp1.on('temperature', function (temp) {
  console.log('Current temp =', temp, 'C')
})

temp1.start()
