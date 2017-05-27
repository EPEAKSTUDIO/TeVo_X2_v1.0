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

// Conversion values
/* temperature -> voltage
 * range: -200C < t <= 0C
 */
const c_0 = 0.0;
const c_1 = 3.9450128025e1;
const c_2 = 2.3622373598e-2;
const c_3 = -3.2858906784e-4;
const c_4 = -4.9904828777e-6;
const c_5 = -6.7509059173e-8;
const c_6 = -5.7410327428e-10;
const c_7 = -3.1088872894e-12;
const c_8 = -1.0451609365e-14;
const c_9 = -1.9889266878e-17;
const c_10 = -1.6322697486e-20;

/* temperature -> voltage
 * range: 0C < t
 */
const d_0 = -1.7600413686e1;
const d_1 = 3.8921204975e1;
const d_2 = 1.8558770032e-2;
const d_3 = -9.9457592874e-5;
const d_4 = 3.1840945719e-7;
const d_5 = -5.6072844889e-10;
const d_6 = 5.6075059059e-13;
const d_7 = -3.2020720003e-16;
const d_8 = 9.7151147152e-20;
const d_9 = -1.2104721275e-23;

const f0 = 1.185976e2;
const f1 = -1.183432e-4;


/* voltage -> temperature
 * range v <= 0 mV
 */
const x_0 = 0;
const x_1 = 2.5173462e-2;
const x_2 = -1.1662878e-6;
const x_3 = -1.0833638e-9;
const x_4 = -8.9773540e-13;
const x_5 = -3.7342377e-16;
const x_6 = -8.6632643e-20;
const x_7 = -1.0450598e-23;
const x_8 = -5.1920577e-28;

/* voltage -> temperature
 * range 0 < v <= 20644 mV
 */
const y_0 = 0.0;
const y_1 = 2.508355e-2;
const y_2 = 7.860106e-8;
const y_3 = -2.503131e-10;
const y_4 = 8.315270e-14;
const y_5 = -1.228034e-17;
const y_6 = 9.804036e-22;
const y_7 = -4.413030e-26;
const y_8 = 1.057734e-30;
const y_9 = -1.052755e-35;

voltageFromMax31855 = function(t, t_amb) {
  const a = 41.276;   // uV/C
  return a * (t - t_amb);
}

// ITS-90 conversion, temperature -> voltage
voltageFromTemperature = function(t) {
  var v = 0;
  if (t <= 0) {
    v = c_0 + (c_1*t) + (c_2*Math.pow(t,2)) + (c_3*Math.pow(t,3)) + (c_4*Math.pow(t,4)) + (c_5*Math.pow(t,5)) + (c_6*Math.pow(t,6)) + (c_7*Math.pow(t,7)) + (c_8*Math.pow(t,8)) + (c_9*Math.pow(t,9)) + (c_10*Math.pow(t,10));
  } else {
    v = d_0 + (d_1*t) + (d_2*Math.pow(t,2)) + (d_3*Math.pow(t,3)) + (d_4*Math.pow(t,4)) + (d_5*Math.pow(t,5)) + (d_6*Math.pow(t,6)) + (d_7*Math.pow(t,7)) + (d_8*Math.pow(t,8)) + (d_9*Math.pow(t,9)) + f0 * Math.exp(f1 * Math.pow(t-126.9686,2));
  }
  return v; // uV
}

// ITS-90 conversion, voltage -> temperature
temperatureFromVoltage = function (v) {
  var t = 0;
  if (v <= 0) {
    t = x_0 + (x_1*v) + (x_2*Math.pow(v,2)) + (x_3*Math.pow(v,3)) + (x_4*Math.pow(v,4)) + (x_5*Math.pow(v,5)) + (x_6*Math.pow(v,6)) + (x_7*Math.pow(v,7)) + (x_8*Math.pow(v,8));
  } else {
    t = y_0 + (y_1*v) + (y_2*Math.pow(v,2)) + (y_3*Math.pow(v,3)) + (y_4*Math.pow(v,4)) + (y_5*Math.pow(v,5)) + (y_6*Math.pow(v,6)) + (y_7*Math.pow(v,7)) + (y_8*Math.pow(v,8)) + (y_9*Math.pow(v,9));
  }
  return t; // degC temperature difference
}

correctedTemperature = function (t, t_amb) {
  var v = voltageFromMax31855(t, t_amb);
  v_amb = voltageFromTemperature(t_amb);
  return temperatureFromVoltage(v + v_amb);
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
  var internalTemperature = reading * 0.0625
  results.internalTemperature = internalTemperature;

  // Sensor temperature
  if (value & 0x80000000) { // Check if signedbit is set.
    // Convert by taking complement then shifting, this order needed for proper conversion
    reading = ~value
    reading = ((value >> 18) + 1 )

  } else { // Positive value, just shift the bits to get the value.
    reading = value >> 18;
  }
  // Scale by 0.25 degrees C per bit as per spec
  var sensorTemperature = reading * 0.25;

  results.sensorTemperature = correctedTemperature(sensorTemperature, internalTemperature);

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
