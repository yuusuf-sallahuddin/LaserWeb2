// Grbl is build with the revealing prototype patern.

var Grbl = function () {
	this.initiated = false;
	this.controls = {
		'$$': {description: 'view Grbl settings'},
		'$#': {description: 'view # parameters', parameter:'#'},
		'$G': {description: 'view parser state'},
		'$I': {description: 'view build info'},
		'$N': {description: 'view startup blocks'},
		'$#': {parameter: '#', description:'save Grbl setting', value: ''},
		'$N#':{parameter: '#', description: 'save startup block', value: ''},
		'$C': {description: 'check gcode mode'},
		'$X': {description: 'kill alarm lock'},
		'$H': {description: 'run homing cycle'},
		'~' : {description: 'cycle start'},
		'!' : {description: 'feed hold'},
		'?' : {description: 'current status'},
		'ctrl-x' : {description: 'reset Grbl'} 
	};
	this.settings = {

	}
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

	    if (messageError && debug) {
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

		messageType = (messageType === null && data[0] === '<' && data[data.length-2] === '>')? 'statusReport':messageType;
		messageType = (messageType === null && data.indexOf('[') > -1 && data.indexOf(']') > -1)? 'feedbackMessage': messageType;
		messageType = (messageType === null && data.indexOf('ok') > -1)? 'ok':messageType; 
		messageType = (messageType === null && data.indexOf('error:') > -1)? 'error':messageType;
		messageType = (messageType === null && data[0] === '$')? 'setting':messageType;

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

		if (messageType) {
			switch (messageType) {
				case 'statusReport' :
					// remove first < and last > and split on , and :
					var rawMessageArray = data.substr(1,data.length-2).split(/,|:/);

					if (!checkStatusReportForError(rawMessageArray)) {
						grblState = {
							state : rawMessageArray[0],
							MPos  : [rawMessageArray[2],rawMessageArray[3],rawMessageArray[4]],
							WPos  : [rawMessageArray[6],rawMessageArray[7],rawMessageArray[8]],
							S     : rawMessageArray[10],
							laserOff : rawMessageArray[12]
						}
						$.extend(true,this,grblState);
						error = false;

					} else {
						error = true;
					}
					break;
				case 'feedbackMessage' :
	    			// get grblMessages between []
					var grblFeedBackMessage = data.replace(/.*\[|\]/gi,'');
					printLog("<b>Grbl message: </b><i>" +grblFeedBackMessage + "</i>",warncolor);
					error = false;
					break;
				case 'ok' :
					printLog(data,successcolor);
					error = false;
					break;
				case 'error' :
					printLog(data,errorcolor);
					error = false;
					break;
				case 'setting' :
					var isSetting = function (setting) {
						var suffix = parseInt(setting.substring(1,setting.length));
						// check if returns NaN. NaN === NaN always returns false
						return suffix === suffix? true:false;
					}
					var setting = data.split('=')[0]
					if (isSetting(setting)) {
						var value = data.split('=')[1].split(' ')[0];
						var description = data.replace(/.*\(|\)/gi,'').slice(0, -1);
						this.settings[setting] = {
							value: value,
							description: description
						}
						printLog("<b>Grbl setting: </b> <i>" + description + '= '+ value + "</i>",msgcolor);
					}
					error = false;
					break;
				case 'control' :
					printLog("<b>Grbl control: </b> <i>" + data + "</i>",msgcolor);
					error = false;
					break;
				default:
					printLog(data,msgcolor);
					error = true;
			}
		} else {
			error = true;
		}
		return error? 0:messageType;
	}

	return {
		parseData : parseData, // parses incoming data and returns parsed messageType
		setVersion: setVersion
	}
} ();