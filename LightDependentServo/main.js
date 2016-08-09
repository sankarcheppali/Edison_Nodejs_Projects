/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)
//Light Sensor-- A1

var LIGHT_CUT_OFF=10;
var groveSensor=require('jsupm_grove');
var light=new groveSensor.GroveLight(1);
setInterval(monitorLight,500);

function monitorLight(){
   if(light.value()>LIGHT_CUT_OFF){
       //set the servo at 90
   }    
   else{
       //set the servo at 0
   }    
}