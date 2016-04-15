// colors for the consolelog
var msgcolor = '#000000';
var successcolor = '#00aa00';
var errorcolor = '#cc0000';
var warncolor = '#ff6600';

var debug = false;


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
  readMacros();
  grbl = new Grbl();
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

  $('#macroEdit').editableTableWidget({ preventColumns: [1, 4] });
  //$('#macroEdit').editableTableWidget();

  // Show/Hide Macro Pad
  $('#togglemacro').on('click', function() {
    printLog('Toggling Button Pad', msgcolor);
    $('#macro_container').toggle();
    $('#viewer_container').toggle();
    $('#renderArea').toggle();
    if ($( "#togglemacro" ).hasClass( "btn-primary" )) {
      $( "#togglemacro" ).removeClass( "btn-primary" )
      $( "#togglemacro" ).addClass( "btn-default" )
    } else {
      $( "#togglemacro" ).removeClass( "btn-default" )
      $( "#togglemacro" ).addClass( "btn-primary" )
    }
	});

  // Show/Hide Macro Pad
  $('#editmacro').on('click', function() {

    printLog('Editing Macros', msgcolor);
    $("#macrostbody").empty();
    readMacros();
    $('#macro_pad').toggle();
    $('#macro_settings').toggle();
    $('#editmacro').hide();
    $('#savemacro').show();
    // $('#viewer_container').toggle();
    // $('#renderArea').toggle();
  });

  $('#addrow').on('click', function() {
    $('#macroEdit > tbody:last-child').append('<tr><td></td><td>...Label for new Button...</td><td>G0 X100 (for example)</td><td><button type="button" class="btn btn-sm btn-default" onclick="deleteRow(this);"><i class="fa fa-times"></i></button></td></tr>');
    $('#macroEdit').editableTableWidget({ preventColumns: [1, 4] });
  });

  $('#savemacro').on('click', function() {
    printLog('Saving Macros', msgcolor);
    $('#macro_pad').toggle();
    $('#macro_settings').toggle();
    $('#savemacro').hide();
    $('#editmacro').show();
    // Cleanup
    for (i=1; i < 24; i++) {
      var name = 'macro' + i;
      localStorage.removeItem(name);
    };
    //gets table
     var oTable = document.getElementById('macroEdit');

     //gets rows of table
     var rowLength = oTable.rows.length;

     //loops through rows
     for (i = 1; i < rowLength; i++){
       var macro = [];
       //gets cells of current row
        var oCells = oTable.rows.item(i).cells;

        //gets amount of cells of current row
        var cellLength = oCells.length;

        //loops through each cell in current row
        for(var j = 0; j < cellLength; j++){

               // get your cell info here

               var cellVal = oCells.item(j).innerHTML;
               console.log(cellVal);
               macro.push(cellVal);
            };
        var name = 'macro' + i;
        localStorage.setItem(name, macro);
     };
     readMacros();
  });


  // Viewer

  var viewer = document.getElementById('renderArea');
 

  // Progressbar
  //NProgress.configure({ parent: '#consolemodule' });
  NProgress.configure({ showSpinner: false });


});
// End of document.ready

// Table Auto Numbering Helper from http://jsfiddle.net/DominikAngerer/yx275pyd/2/
function runningFormatter(value, row, index) {
    return index;
}

// Table Delete row with onclick="deleteRow(this)
function deleteRow(t)
{
    var row = t.parentNode.parentNode;
    document.getElementById("macroEdit").deleteRow(row.rowIndex);
    console.log(row);
}

function readMacros() {
  $("#macro_pad").empty();
  $('#macro_pad').append('<div class="list-group"><a href="#" class="list-group-item"><h4 class="list-group-item-heading">Macro Buttons</h4><p class="list-group-item-text">Custom preset GCode commands:</p></a></div>');
  for (i=1; i < 24; i++) {
    var name = 'macro' + i;
    var val = localStorage.getItem(name);
    if (val) {
      var details = val.split(',');
      var label = details[1];
      var gcode = String(details[2]);
      $('#macroEdit > tbody:last-child').append('<tr><td></td><td>'+ details[1] + '</td><td>'+ details[2] +'</td><td><button type="button" class="btn btn-sm btn-default" onclick="deleteRow(this);"><i class="fa fa-times"></i></button></td></tr>');
      if (i == 0 ) {
        $('#macro_pad').append('<div class="row"><div class="col-sm-2"><button type="button" class="btn btn-lg btn-default" id="macro'+i+'" style="width:100%; height:100%;" onclick="sendGcode(' + '\'' + gcode+ '\'' + ')">'+label+'</button></div>');
      } else if (i == 5 || i== 11 || i == 17 ) {
        $('#macro_pad').append('</div><div class="row"><div class="col-sm-2"><button type="button" class="btn btn-lg btn-default" id="macro'+i+'" style="width:100%; height:100%;"  onclick="sendGcode(' + '\'' + gcode+ '\'' + ')">'+label+'</button></div>');
      } else {
        $('#macro_pad').append('<div class="col-sm-2"><button type="button" class="btn btn-lg btn-default" id="macro'+i+'" style="width:100%; height:100%;"  onclick="sendGcode(' + '\'' + gcode+ '\'' + ')">'+label+'</button></div>');
      }
      $('#macro_pad').append('</div>'); // close the last row
    };
  };
}

// From here down we can have the actual functions

// Error handling
errorHandlerJS = function() {
  window.onerror = function(message, url, line) {
    message = message.replace(/^Uncaught /i, "");
    //alert(message+"\n\n("+url+" line "+line+")");
    console.log(message+"\n\n("+url+" line "+line+")");
    if (message.indexOf('updateMatrixWorld') == -1) { // Ignoring threejs messages, add more || as discovered
      printLog(message+"\n("+url+" on line "+line+")", errorcolor);
    }

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
              printLog('DXF Opened', successcolor);
              $('#cammodule').show();
              putFileObjectAtZero();
              resetView()
              $('#stlopt').hide();
              $('#prepopt').show();
              $('#prepopt').click();
              attachTransformWidget();
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
              printLog('SVG Opened', successcolor);
              $('#cammodule').show();
              putFileObjectAtZero();
              resetView()
              $('#stlopt').show();
              $('#prepopt').show();
              $('#prepopt').click();
              attachTransformWidget();
            };

      } else if (f.name.match(/.gcode$/i)) {
             cleanupThree();
             r.readAsText(evt.target.files[0]);
             r.onload = function(event) {
               cleanupThree();
               document.getElementById('gcodepreview').value = this.result;
               openGCodeFromText();
               printLog('GCODE Opened', successcolor);
               $('#cammodule').hide();
               $('#rastermodule').hide();
              //  putFileObjectAtZero();
               resetView()
               $('#stlopt').hide();
               $('#prepopt').hide();
             };
     } else if (f.name.match(/.stl$/i)) {
            //r.readAsText(evt.target.files[0]);
            // Remove the UI elements from last run
            cleanupThree();
            var stlloader = new MeshesJS.STLLoader;
            r.onload = function(event) {
                  cleanupThree();
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
                  cleanupThree();
                  stlloader.loadBinaryData(view, faces, 100, window, evt.target.files[0]);
               };
               // start reading file as array buffer
              r.readAsArrayBuffer(evt.target.files[0]);
              printLog('STL Opened', successcolor);
              //$('#cammodule').hide();
              $('#rastermodule').hide();
              $('#cammodule').show();
              $('#stlopt').show();
              $('#prepopt').hide();
              $('#stlopt').click();
        } else {
          console.log(f.name + " is probably a Raster");
          r.readAsDataURL(evt.target.files[0]);
          r.onload = function(event) {
            var imgtag = document.getElementById("origImage");
            imgtag.title = evt.target.files[0].name;
            imgtag.src = event.target.result;
            setImgDims();
            drawRaster();
            printLog('Bitmap Opened', successcolor);
            $('#cammodule').hide();
            $('#rastermodule').show();
            // putFileObjectAtZero();
            resetView()
            $('#stlopt').hide();
            $('#prepopt').hide();
          };
      }
    }
  };

// Removed and null all object when a new file is loaded
function cleanupThree() {
    if (typeof(fileObject) !== 'undefined') {
      scene.remove(fileObject);
      fileObject = null;
    };

    if ( typeof(inflateGrp) != 'undefined' ) {
      scene.remove(inflateGrp);
      inflateGrp = null;
    }

    if ( typeof(slicegroup) != 'undefined' ) {
      scene.remove(slicegroup);
      slicegroup = null;
    }

    if ( typeof(stl) != 'undefined' ) {
      scene.remove(stl);
      stl = null;
    }

    if ( typeof(object) != 'undefined' ) {
      scene.remove(object);
      object = null;
    }

    if ( typeof(fileParentGroup) != 'undefined' ) {
      scene.remove(fileParentGroup);
      fileParentGroup = null;
    }

    if (boundingBox) {
       scene.remove( boundingBox );
       boundingBox = null;
    }
  }


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

localParams = ['spjsip', 'laserXMax', 'laserYMax', 'startgcode', 'laseron', 'laseroff', 'lasermultiply', 'homingseq', 'endgcode', 'useOffset', 'imagePosition'];

function saveSettingsLocal() {
  for (i=0; i < localParams.length; i++) {
    var val = $('#'+localParams[i]).val(); // Read the value from form
    console.log('Saving: ', localParams[i], ' : ', val);
    localStorage.setItem(localParams[i], val);
  };
};

function loadSettingsLocal() {
  for (i=0; i < localParams.length; i++) {
    var val = localStorage.getItem(localParams[i]);
    if (val) {
      console.log('Loading: ', localParams[i], ' : ', val);
      $('#'+localParams[i]).val(val) // Set the value to Form from Storage
    };
  };
};

function printLog(text, color) {
  $('#console').append('<p class="pf" style="color: '+ color +';">' +text);
  $('#console').scrollTop($("#console")[0].scrollHeight - $("#console").height());
};
