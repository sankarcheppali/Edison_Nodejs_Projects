/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)


//MRAA Library was installed on the board directly through ssh session
var mraa = require("mraa");
console.log("Program starteed");
startSensorWatch();

//GROVE Kit Shield D6 --> GPIO6--Buzzer
//GROVE Kit Shield D2 --> GPIO2--Touch sensor
function startSensorWatch() {
    'use strict';
    var touch_sensor_value = 0, last_t_sensor_value;

    //Touch Sensor connected to D2 connector
    var digital_pin_D2 = new mraa.Gpio(2);
    digital_pin_D2.dir(mraa.DIR_IN);

    //Buzzer connected to D6 connector
    var digital_pin_D6 = new mraa.Gpio(6);
    digital_pin_D6.dir(mraa.DIR_OUT);

    digital_pin_D6.write(0);

    setInterval(function () {
        touch_sensor_value = digital_pin_D2.read();
        if (touch_sensor_value === 1 && last_t_sensor_value === 0) {
            console.log("Buzz ON!!!");
            digital_pin_D6.write(touch_sensor_value);
        } else if (touch_sensor_value === 0 && last_t_sensor_value === 1) {
            console.log("Buzz OFF!!!");
            digital_pin_D6.write(touch_sensor_value);
        }
        last_t_sensor_value = touch_sensor_value;
    }, 500);
}
