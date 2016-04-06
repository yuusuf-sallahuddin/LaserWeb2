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
	},
	setVersion= function (version) {
		this.initiated = true;
		this.version = version;
		return this.version
	},
	parseData = function (data) {
		var messageType = null;
		var grblState = {};

		messageType = (messageType === null && data[0] === '<' && data[data.length-2] === '>')? 'statusReport':messageType;
		messageType = (messageType === null && data.indexOf('[') > -1 && data.indexOf(']') > -1)? 'feedbackMessage': messageType;
		messageType = (messageType === null && data.indexOf('ok') > -1)? 'ok':messageType; 
		messageType = (messageType === null && data.indexOf('error:') > -1)? 'error':messageType;
		messageType = (messageType === null && data[0] === '$')? 'setting':messageType; 

		if (messageType) {
			switch (messageType) {
				case 'statusReport' :
					// remove first < and last > and split on , and :
					this.rawMessageArray = data.substr(1,data.length-2).split(/,|:/);

					if (!this.checkStatusReportForError()) {
						grblState = {
							state : this.rawMessageArray[0],
							MPos  : [this.rawMessageArray[2],this.rawMessageArray[3],this.rawMessageArray[4]],
							WPos  : [this.rawMessageArray[6],this.rawMessageArray[7],this.rawMessageArray[8]],
							S     : this.rawMessageArray[10],
							laserOff : this.rawMessageArray[12]
						}
						$.extend(true,this,grblState);
						this.error = false;

					} else {
						this.error = true;
					}
					break;
				case 'feedbackMessage' :
	    			// get grblMessages between []
					var grblFeedBackMessage = data.replace(/.*\[|\]/gi,'');
					printLog("<b>Grbl message: </b><i>" +grblFeedBackMessage + "</i>",warncolor);
					this.error = false;
					break;
				case 'ok' :
					printLog(data,successcolor);
					this.error = false;
					break;
				case 'error' :
					printLog(data,errorcolor);
					this.error = false;
					break;
				case 'setting' :
					this.error = false;
					break;
				default:
					printLog(data,msgcolor);
					this.error = true;
			}
		} else {
			this.error = true;
		}
		return this.error? 0:messageType;
	}

	return {
		parseData : parseData, // parses incoming data and returns parsed messageType
		setVersion: setVersion
	}
} ();