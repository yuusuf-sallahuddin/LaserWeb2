// Grbl is build with the revealing prototype patern.

var Grbl = function () {
	this.initiated = false;
}

Grbl.prototype = function () {
	var checkStatusReportForError = function (rawMessageArray) {
		var messageArray = rawMessageArray || this.rawMessageArray
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
	var detectMessageType = function (data) {
		var messageType = null;

		messageType = (messageType === null && data[0] === '<' && data[data.length-2] === '>')? 'statusReport':messageType;
		messageType = (messageType === null && data.indexOf('[') > -1 && data.indexOf(']') > -1)? 'feedbackMessage': messageType;
		messageType = (messageType === null && data.indexOf('ok') > -1)? 'ok':messageType; 
		messageType = (messageType === null && data.indexOf('error:') > -1)? 'error':messageType;
		messageType = (messageType === null && data[0] === '$')? 'setting':messageType; 

		return messageType;
	}
	var parseData = function (data) {
		var error;
		var messageType = detectMessageType(data);
		var grblState = {};

		if (messageType) {
			switch (messageType) {
				case 'statusReport' :
					// remove first < and last > and split on , and :
					var rawMessageArray = data.substr(1,data.length-2).split(/,|:/);

					if (!this.checkStatusReportForError()) {
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
					// split on :
					// trim spaces
					// this.settings[name] = value
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