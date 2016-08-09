//Send acceloremeter readings to AWS IoT every 50ms, if the values are changed more than specified tollerance
//install aws iot device sdk if not done already - npm install -g aws-iot-device-sdk
// configure jshint
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */


var digitalAccelerometer = require('jsupm_mma7660');
var awsIot = require('aws-iot-device-sdk');

var AccTopic="/iot/edison/acc",DELTA=10,SAMPLING_RATE=2;

var device = awsIot.device({
   keyPath: "/home/root/awsCert/privateKey.pem",
  certPath: "/home/root/awsCert/cert.pem",
    caPath: "/home/root/awsCert/rootCA.pem",
  clientId: "EdisonAcc",
    region: "us-west-2" 
});

// Instantiate an MMA7660 on I2C bus 0
var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
					digitalAccelerometer.MMA7660_I2C_BUS, 
					digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);


// place device in standby mode so we can write registers
myDigitalAccelerometer.setModeStandby();

// enable 64 samples per second
myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);

// place device into active mode
myDigitalAccelerometer.setModeActive();

var x, y, z;
x = digitalAccelerometer.new_intp();
y = digitalAccelerometer.new_intp();
z = digitalAccelerometer.new_intp();

var ax, ay, az;
ax = digitalAccelerometer.new_floatp();
ay = digitalAccelerometer.new_floatp();
az = digitalAccelerometer.new_floatp();

device
  .on('connect', function() {
    console.log('connected');
    startSampling(1000/SAMPLING_RATE);
    });

var outputStr;

function startSampling(rate){
 setInterval(function()
{
	myDigitalAccelerometer.getRawValues(x, y, z);
	outputStr = "Raw values: x = " + digitalAccelerometer.intp_value(x) +
	" y = " + digitalAccelerometer.intp_value(y) +
	" z = " + digitalAccelerometer.intp_value(z);
	console.log(outputStr);
     sendDatatoAWS(digitalAccelerometer.intp_value(x),digitalAccelerometer.intp_value(y),digitalAccelerometer.intp_value(z));
/*
	myDigitalAccelerometer.getAcceleration(ax, ay, az);
	outputStr = "Acceleration: x = " 
		+ roundNum(digitalAccelerometer.floatp_value(ax), 6)
		+ "g y = " + roundNum(digitalAccelerometer.floatp_value(ay), 6) 
		+ "g z = " + roundNum(digitalAccelerometer.floatp_value(az), 6) + "g";
	console.log(outputStr);*/
}, rate);
}
var px=0,py=0,pz=0;
function sendDatatoAWS(x,y,z){
    if( (Math.abs(x-px)< DELTA) && (Math.abs(y-py)< DELTA) && (Math.abs(z-pz)< DELTA) ){
        //do not send data to cloud
    }
    else{
        //send data to cloud
        px=x;py=y;pz=z;
        device.publish(AccTopic, JSON.stringify({ 'x':x,'y':y,'z':z }));
        console.log("Published data to topic "+AccTopic);
    }
}
// round off output to match C example, which has 6 decimal places
function roundNum(num, decimalPlaces)
{
	var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
	return (Math.round((num + extraNum) 
		* (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));
}

// When exiting: clear interval and print message
process.on('SIGINT', function()
{
	clearInterval(myInterval);

	// clean up memory
	digitalAccelerometer.delete_intp(x);
	digitalAccelerometer.delete_intp(y);
	digitalAccelerometer.delete_intp(z);

	digitalAccelerometer.delete_floatp(ax);
	digitalAccelerometer.delete_floatp(ay);
	digitalAccelerometer.delete_floatp(az);

	myDigitalAccelerometer.setModeStandby();

	console.log("Exiting...");
	process.exit(0);
});