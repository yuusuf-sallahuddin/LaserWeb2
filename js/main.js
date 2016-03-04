
// Place all document.ready tasks into functions and ONLY run the functions from doument.ready
$(document).ready(function() {

  // Intialise
  loadSettingsLocal();
  getPortList();
  init3D();
  animate();

  // Top toolbar Menu

  //File -> Open
  var fileOpen = document.getElementById('file');
  fileOpen.addEventListener('change', readFile, false);

  // File -> Save
  $('#save').on('click', function() {
	  saveFile();
	});

  // File...

  $('#connect').on('click', function() {
		serialConnect($('#port').val(), $('#baud option:selected').val(), $('#buffer').val());
	});

  $('#refreshPort').on('click', function() {
    $('#port').find('option').remove().end()
    $('#buffer').find('option').remove().end()
    getPortList();
	});

  $('#savesettings').on('click', function() {
		saveSettingsLocal();
	});



});
// End of document.reader

// From here down we can have the actual functions

// Function to execute when opening file (triggered by fileOpen.addEventListener('change', readFile, false); )
function readFile(evt) {
  // Close the menu
  $("#drop1").dropdown("toggle");
  // Filereader
  var f = evt.target.files[0];
    if (f) {
      var r = new FileReader();
      if (f.name.match(/.dxf$/i)) {
            console.log(f.name + " is a DXF file");
      } else if (f.name.match(/.svg$/i)) {
            console.log(f.name + " is a SVG file");
      } else if (f.name.match(/.gcode$/i)) {
            console.log(f.name + " is a GCODE filee");
      } else {
            console.log(f.name + " is probably a Raster");
      }
    }
  };

function saveFile() {
  var textToWrite = document.getElementById("gcodepreview").value;
  var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
  var fileNameToSaveAsExt = document.getElementById("fileName").value;
  var fileNameToSaveAs = fileNameToSaveAsExt.replace(/\.[^/.]+$/, "")
  var fileNameToSaveAs = fileNameToSaveAs + '-LaserWeb.gcode';

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null)
  {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  }
  else
  {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  };
};

localParams = ['spjsip', 'laserXMax', 'laserYMax', 'startgcode', 'laseron', 'laseroff', 'lasermultiply', 'homingseq', 'endgcode'];

function saveSettingsLocal() {
  for (i in localParams) {
    var val = $('#'+localParams[i]).val(); // Read the value from form
    console.log('Saving: ', localParams[i], ' : ', val);
    localStorage.setItem(localParams[i], val);
  };
};

function loadSettingsLocal() {
  for (i in localParams) {
    var val = localStorage.getItem(localParams[i]);
    if (val) {
      console.log('Loading: ', localParams[i], ' : ', val);
      $('#'+localParams[i]).val(val) // Set the value to Form from Storage
    };
  };
};

function logSettingsLocal() {
  for (var key in localStorage) {
  console.log(key + ':' + localStorage[key]);
}


}