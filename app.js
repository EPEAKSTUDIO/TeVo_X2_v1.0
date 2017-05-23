// Use module from local version for the time being
var max31855 = require('./max31855');

// ROG_EXT
var i2c = require('i2c-bus'),
    i2c1;
var rog_ext = require('./rog_ext');



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
