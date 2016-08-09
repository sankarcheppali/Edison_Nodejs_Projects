/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

//Light Sensor-- A1,serv to GPIO 5

var LIGHT_CUT_OFF=10;
var groveSensor=require('jsupm_grove');
var light=new groveSensor.GroveLight(1);
setInterval(monitorLight,500);
//Load servo module.
var servoModule = require("jsupm_servo");

//Instantiate ES08A Servo module on GPIO 5
var servo = new servoModule.ES08A(5);

function monitorLight(){
   if(light.value()>LIGHT_CUT_OFF){
       //set the servo at 90
       servo.setAngle(90);
   }    
   else{
       //set the servo at 0
       servo.setAngle(0);
   }    
}