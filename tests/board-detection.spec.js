var test = require('tape');
var proxyquire = require('proxyquire');

test('pid board detection', function(t) {
  t.plan(1);
  var Avrgirl = proxyquire.noCallThru().load('../avrgirl-arduino', {
    serialport: {
      list: function(callback) {
        callback(null, [
          { comName: '/dev/cu.sierravsp', manufacturer: '', serialNumber: '',
            pnpId: '', locationId: '', vendorId: '', productId: '' },
          { comName: '/dev/cu.Bluetooth-Incoming-Port', manufacturer: '',
            serialNumber: '', pnpId: '', locationId: '', vendorId: '',
            productId: '' },
          { comName: '/dev/cu.usbmodem1421', manufacturer: 'Arduino (www.arduino.cc)',
            serialNumber: '55432333038351F03170', pnpId: '', locationId: '0x14200000',
            vendorId: '0x2341', productId: '0x0043' }
        ]);
      },

      SerialPort: require('./helpers/mockSerial').SerialPort
    },
    stk500: require('./helpers/mockStk500')
  });
  var avrgirl = new Avrgirl({
    board: 'uno',
  });
  avrgirl.flash('junk/hex/uno/Blink.cpp.hex', function() {
    t.equal(avrgirl.options.port, '/dev/cu.usbmodem1421', 'found an uno on /dev/cu.usbmodem1421');
    t.end();
  });
});

test('pnpId board detection', function(t) {
  t.plan(1);
  var Avrgirl = proxyquire.noCallThru().load('../avrgirl-arduino', {
    serialport: {
      list: function(callback) {
        callback(null, [
          { comName: 'COM3', manufacturer: 'Microsoft', serialNumber: '',
            pnpId: 'USB\\\\VID_2341&PID_0043\\\\55432333038351F03170',
            locationId: '', vendorId: '', productId: '' }
        ]);
      },

      SerialPort: require('./helpers/mockSerial').SerialPort
    },
    stk500: require('./helpers/mockStk500')
  });
  var avrgirl = new Avrgirl({
    board: 'uno',
  });
  avrgirl.flash('junk/hex/uno/Blink.cpp.hex', function() {
    t.equal(avrgirl.options.port, 'COM3', 'found an uno on COM3');
    t.end();
  });
});
