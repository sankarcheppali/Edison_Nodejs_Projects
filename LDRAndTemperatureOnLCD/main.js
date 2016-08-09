//Connect Temperature sensor to A0
//Connect Light Sensor to A1
// configure jshint
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Load Grove module
var groveSensor = require('jsupm_grove');
 
// we want mraa to be at least version 0.6.1
var mraa = require('mraa');
var version = mraa.getVersion();
 
if (version >= 'v0.6.1') {
 console.log('mraa version (' + version + ') ok');
 useUpm();
 
}
else {
 console.log('meaa version(' + version + ') is old - this code may not work');
}
 
 
/**
 * Refresh the data periodically 
 * 
 */
function showData(display) {
 var red = 0;
 var green = 50;
 var blue = 200;
 display.setColor(red, green, blue);
 setInterval(function() {
 display.clear();
 display.setCursor(0,0);
 display.write('Temperature:' + getTemperature() + 'C');
 display.setCursor(1,0);
 display.write('Light:' + getLDR() + 'Lux'); 
 }, 1000);
}
var light=new groveSensor.GroveLight(1);
 
function getLDR(){
 return light.value();
}
var temp=new groveSensor.GroveTemp(0);
function getTemperature(){
 var data=temp.value();
 return data;
 //return (data*500)/1024;
}
 
/**
 * Use the upm library to drive the two line display
 *
 */
function useUpm() {
 var lcd = require('jsupm_i2clcd');
 var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
 showData(display);
}