/**
 * Node.js module for driving the Adafruit MAX31855 thermocouple temperature amplifier on Raspberry Pi.
 *
 * Currently supports only hardware SPI configuration (as opposed to software SPI using GPIO pins).
 * Note: May require running under sudo for SPI permissions.
 * Note: The SPI master driver is disabled by default on Raspian Linux and must be enabled. see here:
 * https://www.raspberrypi.org/documentation/hardware/raspberrypi/spi/README.md
 */

var SPI = require('pi-spi');

// Bus number (bs) and Chip Select (cs) are required input parameters
function MAX31855(bus, cs) {

  // Initialize the SPI settings
  this._spi = SPI.initialize("/dev/spidev"+bus+"."+cs);
  this._spi.clockSpeed(5000000);
  this._spi.dataMode(0);
  this._spi.bitOrder(SPI.order.MSB_FIRST);
}

convertReading = function(value) {
  var results = {}
  var reading;

  // Internal temperature
  if (value & 0x8000) { // Check if signedbit is set.
    // Negative value, take 2's compliment.
    reading = ~value
    reading = (((value >> 4) & 0xfff) + 1)
  } else {
    reading = (value >> 4) & 0xfff
  }
  // Scale by 0.0625 degrees C per bit and return value.
  results.internalTemperature = reading * 0.0625;

  // Sensor temperature
  if (value & 0x80000000) { // Check if signedbit is set.
    // Convert by taking complement then shifting, this order needed for proper conversion
    reading = ~value
    reading = ((value >> 18) + 1 )

  } else { // Positive value, just shift the bits to get the value.
    reading = value >> 18;
  }
  // Scale by 0.25 degrees C per bit as per spec
  results.sensorTemperature = reading * 0.25;

  return results
}

/** Read 32 bits from the SPI bus. */
MAX31855.prototype._read32 = function(callback) {
  this._spi.read(4, function(error, bytes) {
    if(error) {
      console.error(error);
    } else {
      if(!bytes || bytes.length != 4) {
        throw new Error('MAX31855: Did not read expected number of bytes from device!');
      } else {
        value = bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
        // DEBUG
        // console.log(bytes.toString('hex'));
        callback(value);
      }
    }
  });
};

/** Returns the internal temperature value in degrees Celsius. */
MAX31855.prototype.readStatus = function(callback) {
  if (callback) {
    this._read32(function(value) {
      callback(convertReading(value));
    });
  } else {
    console.log('MAX31855: Read request issued with no callback.');
  }
};

module.exports = MAX31855;
