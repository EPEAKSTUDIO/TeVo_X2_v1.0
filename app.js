// Use module from local version for the time being
var max31855 = require('./max31855');

const thermocouple1 = new max31855(0, 0);
const thermocouple2 = new max31855(0, 1);

var hello = setInterval(function() {

  thermocouple1.readTempC(function(temp) {
      console.log('TC1 - Temp in ℃    : ', temp);
  });
  thermocouple1.readInternalC(function(temp) {
      console.log('TC1 - Internal in ℃: ', temp);
  });

  thermocouple2.readTempC(function(temp) {
      console.log('TC2 - Temp in ℃    : ', temp);
  });
  thermocouple2.readInternalC(function(temp) {
      console.log('TC2 - Internal in ℃: ', temp);
  });

  console.log('------')
  },
  1000);
