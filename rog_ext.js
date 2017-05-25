/**
 * Node.js module for adapating the readings over I2c from the ROG_EXT on Raspberry Pi.
 *
 * Code written by Gergely Imreh - Huge thanks!
 */

/* Display in HEX and zero pad */

var ROG_EXT = {

  pad: function(n, width, z) {
    z = z || '0';
    n = n.toString(16) + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

/* Change endiannes / swap two bytes of a word */
  swap16: function (val) {
    return ((val & 0xFF) << 8) | ((val >> 8) & 0xFF);
  }

  toClk: function (rawValue) {
    return swap16(rawValue) * 0.1;
  }

/* Volts conversion */
  toVolts: function (rawValue) {
    return swap16(rawValue) * 0.005;
  }

/* Fan RPM conversion */
  toRPM: function (rawValue) {
    return swap16(rawValue);
  }

}

module.exports = ROG_EXT;


/*
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
*/
