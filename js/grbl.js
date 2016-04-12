"use strict";
// Grbl is build with the revealing prototype pattern.

var Grbl = function () {
	this.initiated = false;
	this.controls = {
		'$$': {description: 'view Grbl settings'},
		'$#': {description: 'view # parameters', parameter:'#'},
		'$G': {description: 'view parser state'},
		'$I': {description: 'view build info'},
		'$N': {description: 'view startup blocks'},
		'$#=': {parameter: '#', description:'save Grbl setting', value: ''},
		'$N#':{parameter: '#', description: 'save startup block', value: ''},
		'$C': {description: 'check gcode mode'},
		'$X': {description: 'kill alarm lock'},
		'$H': {description: 'run homing cycle'},
		'~' : {description: 'cycle start'},
		'!' : {description: 'feed hold'},
		'?' : {description: 'current status'},
		'ctrl-x' : {description: 'reset Grbl'}
	};
	this.settings = {}
}

Grbl.prototype = function () {
	var checkStatusReportForError = function (rawMessageArray) {
		var messageArray = rawMessageArray
		var messageError = false;

		messageError = messageArray[0] === "Alarm" || messageArray[0] === "Idle" || messageArray[0] === "Run"? false:true;
	    messageError = messageArray[1] === "MPos" && !messageError? false:true;
	    messageError = messageArray[5] === "WPos" && !messageError? false:true;
	    messageError = messageArray[9] === "S" && !messageError? false:true;
	    messageError = messageArray[11] === "laser off" && !messageError? false:true;

	    if (messageError) {
	    	console.warn(messageArray);
	    }

	    return messageError
	}
	var setVersion= function (version) {
		this.initiated = true;
		this.version = version;
		return this.version
	}
	var detectMessageType = function (data, grbl) {
		var messageType = null;

		messageType = (messageType === null && data[0] === '<' && data.indexOf('>') > -1)? 'statusReport':messageType;
		messageType = (messageType === null && data.indexOf('[') > -1 && data.indexOf(']') > -1)? 'feedbackMessage': messageType;
		messageType = (messageType === null && data.indexOf('ok') > -1)? 'ok':messageType;
		messageType = (messageType === null && data.indexOf('error:') > -1)? 'error':messageType;
		messageType = (messageType === null || messageType === 'feedbackMessage' && data[0] === '$')? 'setting':messageType;

		if (messageType === null || messageType === 'setting') {
			for (var key in grbl.controls) {
	    		if (grbl.controls.hasOwnProperty(key)) {
	    			var control = grbl.controls[key];
		    		if (data.indexOf(control.description) > -1) {
		    			messageType = 'control'
		    			break;
		    		}
	    		}
	    	}
		}

		return messageType;
	}
	var parseData = function (data) {
		var error;
		var messageType = detectMessageType(data,this);
		var grblState = {};
		var message = {}

		if (messageType) {
			switch (messageType) {
				case 'statusReport' :
					// remove first < and last > and split on , and :
					var rawMessageArray = data.substr(data.indexOf('<')+1,data.indexOf('>')-1).split(/,|:/);

					if (!checkStatusReportForError(rawMessageArray)) {
						grblState = {
							state : rawMessageArray[0],
							MPos  : [rawMessageArray[2],rawMessageArray[3],rawMessageArray[4]],
							WPos  : [rawMessageArray[6],rawMessageArray[7],rawMessageArray[8]],
							S     : rawMessageArray[10],
							laserOff : rawMessageArray[12]
						}
						//$.extend(true,this,grblState);
						for (var key in grblState) {
							if (grblState.hasOwnProperty(key)) {
								this[key] = grblState[key];
							}
						}
						error = false;

						message = {
							messageType: messageType,
							state: grblState
						}

					} else {
						error = true;
					}
					break;
				case 'feedbackMessage' :
	    			// get grblMessages between []
					var grblFeedBackMessage = data.replace(/.*\[|\]/gi,'');
//printLog("<b>Grbl message: </b><i>" +grblFeedBackMessage + "</i>",warncolor);
					error = false;

					message = {
						messageType: messageType,
						message: grblFeedBackMessage
					}
					break;
				case 'ok' :
//printLog(data,successcolor);
					error = false;
					message = {
						messageType: messageType,
						message: data
					}
					break;
				case 'error' :
//printLog(data,errorcolor);
					error = false;
					message = {
						messageType: messageType,
						message: data
					}
					break;
				case 'setting' :
					var isSetting = function (setting) {
						var suffix = parseInt(setting.substring(1,setting.length));
						// check if returns NaN. NaN === NaN always returns false
						return suffix === suffix? true:false;
					}
					var setting = data.split('=')[0]
					if (isSetting(setting)) {
						var command = data.split('=')[0];
						var value = data.split('=')[1].split(' ')[0];
						var description = data.replace(/.*\(|\)/gi,'');
						var settings = {
							value: value,
							description: description,
							command: command
						}
						this.settings[setting] = settings
//printLog("<b>Grbl setting: </b> <i>"+ command + '=> ' + description + '= '+ value + "</i>",msgcolor);
					}
					error = false;

					message = {
						messageType: messageType,
						setting: settings
					}
					break;
				case 'control' :
					for (var key in this.controls) {
			    		if (this.controls.hasOwnProperty(key)) {
			    			var control = this.controls[key];
				    		if (data.indexOf(control.description) > -1) {
				    			message = {
									messageType: messageType,
									control: this.controls[key]
								}
								break;
				    		}
			    		}
			    	}

//printLog("<b>Grbl control: </b> <i>" + data + "</i>",msgcolor);
					error = false;

					break;
				default:
//printLog(data,msgcolor);
					error = true;
			}
		} else {
			error = true;
		}
		return error? 0:message;
	}
	var homeCycle = function () {
		return "$H";
	}
	var zeroOut = function () {
		return "G92 X0 Y0 Z0"
	}

	return {
		parseData : parseData, // parses incoming data and returns parsed messageType
		setVersion: setVersion,
		homeCycle: homeCycle,
		zeroOut: zeroOut
	}
} ();


// export code
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Grbl;
    }
    exports.Grbl = Grbl;
} 
