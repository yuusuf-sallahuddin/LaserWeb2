// Place all document.ready tasks into functions and ONLY run the functions from doument.ready
$(document).ready(function() {

  // Intialise
  loadSettingsLocal();
  spjsInit();
  getPortList();
  init3D();
  animate();
  filePrepInit();
  initJog();
  errorHandlerJS();
  var paperscript = {};
  rasterInit();
  //initRaster();

  // Tooltips
  $( document ).tooltip();
  $(document).click(function() {
    $(this).tooltip( "option", "hide", { effect: "clip", duration: 500 } ).off("focusin focusout");
  });

   $('#inflateVal').change(onInflateChange.bind(this));

  // Top toolbar Menu

  //File -> Open
  var fileOpen = document.getElementById('file');
  fileOpen.addEventListener('change', readFile, false);

  // File -> Save
  $('#save').on('click', function() {
	  saveFile();
	});

   // View -> reset
   $('#viewReset').on('click', function() {
     resetView();
 	 });

  // Connection Toolbar
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

  // Viewer

  var viewer = document.getElementById('renderArea');
  viewer.addEventListener('click', function (evt) {
    // The user has clicked; let's note this event
    // and the click's coordinates so that we can
    // react to it in the render loop
    clickInfo.userHasClicked = true;
    clickInfo.x = evt.clientX;
    clickInfo.y = evt.clientY;
  }, false);
    // we just do the following to hide the event from controls
    // and disable moving via mouse buttons
    var stopEvent = function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    };
    //viewer.addEventListener('mousedown', stopEvent, false);
    //viewer.addEventListener('mouseup', stopEvent, false);

    // Progressbar
    //NProgress.configure({ parent: '#consolemodule' });
    NProgress.configure({ showSpinner: false });

});
// End of document.reader

// From here down we can have the actual functions

// Error handling
errorHandlerJS = function() {
  window.onerror = function(message, url, line) {
    message = message.replace(/^Uncaught /i, "");
    //alert(message+"\n\n("+url+" line "+line+")");
    //console.log(message+"\n\n("+url+" line "+line+")");
    //if (url.indexof('three') = -1) { // Ignoring threejs messages
      printLog(message+"\n("+url+" on line "+line+")", '#cc0000');
    //}

  };
};

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
            console.log('Reader: ',r)
            r.readAsText(evt.target.files[0]);
            r.onload = function(e) {
              dxf = r.result
              $('#cammodule').show();
              $('#rastermodule').hide();
              getSettings();
              drawDXF(dxf);
              currentWorld();
              printLog('DXF Opened', '#000000');
              $('#cammodule').show();
              putFileObjectAtZero();
              resetView()
            };

      } else if (f.name.match(/.svg$/i)) {
            console.log(f.name + " is a SVG file");
            r.readAsText(evt.target.files[0]);
            r.onload = function(event) {
              svg = r.result
              // /console.log(svg);
              $('#cammodule').show();
              $('#rastermodule').hide();
              getSettings();
              drawSvg(svg);
              currentWorld();
              printLog('SVG Opened', '#000000');
              $('#cammodule').show();
              putFileObjectAtZero();
              resetView()
            };

      } else if (f.name.match(/.gcode$/i)) {
             r.readAsText(evt.target.files[0]);
             r.onload = function(event) {
               document.getElementById('gcodepreview').value = this.result;
               openGCodeFromText();
               printLog('GCODE Opened', '#000000');
               $('#cammodule').hide();
               $('#rastermodule').hide();
               putFileObjectAtZero();
               resetView()
             };
     } else if (f.name.match(/.stl$/i)) {
            //r.readAsText(evt.target.files[0]);
            var stlloader = new MeshesJS.STLLoader;
            r.onload = function(event) {
                  // Parse ASCII STL
                  if (typeof r.result === 'string' ) {
                     console.log("Inside STL.js Found ASCII");
                     stlloader.loadString(r.result);
                     return;
                  }

                  // buffer reader
                  var view = new DataView(this.result);

                  // get faces number
                  try {
                     var faces = view.getUint32(80, true);
                  }
                  catch(error) {
                     self.onError(error);
                     return;
                  }

                  // is binary ?
                  var binary = view.byteLength == (80 + 4 + 50 * faces);

                  if (! binary) {
                     // get the file contents as string
                     // (faster than convert array buffer)
                     r.readAsText(evt.target.files[0]);
                     return;
                  }

                  // parse binary STL
                  console.log("Inside STL.js Binary STL");
                  stlloader.loadBinaryData(view, faces, 100, window, evt.target.files[0]);
               };
               // start reading file as array buffer
              r.readAsArrayBuffer(evt.target.files[0]);
              printLog('STL Opened', '#000000');
              $('#cammodule').hide();
              $('#rastermodule').hide();
        } else {
          console.log(f.name + " is probably a Raster");
          r.readAsDataURL(evt.target.files[0]);
          r.onload = function(event) {
            var imgtag = document.getElementById("origImage");
            imgtag.title = evt.target.files[0].name;
            imgtag.src = event.target.result;
            setImgDims();
            drawRaster();
            printLog('Bitmap Opened', '#000000');
            $('#cammodule').hide();
            $('#rastermodule').show();
            putFileObjectAtZero();
            resetView()
          };
      }
    }
  };



function saveFile() {
  var textToWrite = document.getElementById("gcodepreview").value;
  var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
  var fileNameToSaveAs = 'LaserWeb.gcode';

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

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

localParams = ['spjsip', 'laserXMax', 'laserYMax', 'startgcode', 'laseron', 'laseroff', 'lasermultiply', 'homingseq', 'endgcode', 'useOffset'];

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
  };
};

function printLog(text, color) {
  $('#console').append('<p class="pf" style="color: '+ color +';">' +text);
  $('#console').scrollTop($("#console")[0].scrollHeight - $("#console").height());
};
