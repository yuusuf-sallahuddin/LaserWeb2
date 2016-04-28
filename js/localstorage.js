localParams = ['spjsip', 'laserXMax', 'laserYMax', 'startgcode', 'laseron', 'laseroff', 'lasermultiply', 'homingseq', 'endgcode', 'useOffset', 'imagePosition'];

function saveSettingsLocal() {
    for (i = 0; i < localParams.length; i++) {
        var val = $('#' + localParams[i]).val(); // Read the value from form
        console.log('Saving: ', localParams[i], ' : ', val);
        localStorage.setItem(localParams[i], val);
    };
};

function loadSettingsLocal() {
    for (i = 0; i < localParams.length; i++) {
        var val = localStorage.getItem(localParams[i]);
        if (val) {
            console.log('Loading: ', localParams[i], ' : ', val);
            $('#' + localParams[i]).val(val) // Set the value to Form from Storage
        };
    };
};

function backupSettingsLocal() {
  var json = JSON.stringify(localStorage)
  var blob = new Blob([json], {type: "application/json"});
    invokeSaveAsDialog(blob, 'laserweb-settings-backup.json');

}
