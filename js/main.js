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
            //console.log(f.name + " is a DXF file");
            console.log('Reader: ',r)
            r.readAsText(evt.target.files[0]);
            r.onload = function(e) {
              console.log('r.onload')
              //fileName = fileInputDXF.value.replace("C:\\fakepath\\", "");

              // Remove the UI elements from last run
              if (typeof(dxfObject) !== 'undefined') {
                scene.remove(dxfObject);
              };

              if (typeof(showDxf) !== 'undefined') {
                scene.remove(showDxf);
              };

              if (typeof(tool_offset) !== 'undefined') {
                scene.remove(tool_offset);
                toolPath = null;
              };


              dxfObject = new THREE.Group();

              row = [];
              pwr = [];
              cutSpeed = [];
              // $('#console').append('<p class="pf" style="color: #000000;"><b>Parsing DXF:...</b></p>');
              // $('#console').scrollTop($("#console")[0].scrollHeight - $("#console").height());

              //NEW Dxf  -- experimental
              parser2 = new window.DxfParser();
              dxf2 = parser2.parseSync(r.result);
              //console.log('DXF Data', dxf2);
              //cadCanvas = new processDXF(dxf2);

              for (i = 0; i < dxf2.entities.length; i++ ) {
                //console.log('Layer: ', dxf2.entities[i].layer);
                row[i] = dxf2.entities[i].layer
                drawEntity(i, dxf2.entities[i]);
              };


              // Make the 'geometry' object disappear
              for (i=0; i<dxfObject.children.length; i++) {
                  //dxfObject.children[i].material.color.setHex(0x000000);
                  dxfObject.children[i].material.opacity = 0.3;
              }

              // Sadly removing it from the scene makes gcode circles end up at 0,0 since localToWorld needs it in the scene
              dxfObject.translateX((laserxmax / 2) * -1);
              dxfObject.translateY((laserymax / 2) * -1);
              scene.add(dxfObject);

              // // Make a copy to show, because we need the original copy, untranslated, for the gcodewriter parsing
              // showDxf = dxfObject.clone();
              // // And display the showpiece, translated to virtual 0,0
              // showDxf = dxfObject.clone();
              // showDxf.translateX(laserxmax /2 * -1);
              // showDxf.translateY(laserymax /2 * -1);
              // scene.add(showDxf);

              Array.prototype.unique = function()
                {
                  var n = {},r=[];
                  for(var i = 0; i < this.length; i++)
                  {
                    if (!n[this[i]])
                    {
                      n[this[i]] = true;
                      r.push(this[i]);
                    }
                  }
                  return r;
              }
              layers = [];
              layers = row.unique();
              //console.log(layers);
              for (var c=0; c<layers.length; c++) {
                  // $('#layers > tbody:last-child').append('<tr><td>'+layers[c]+'</td><td>  <div class="input-group" style="margin-bottom:10px; width: 100%;"><input class="form-control" name=sp'+c+' id=sp'+c+' value=3200><span class="input-group-addon"  style="width: 100px;">mm/m</span></div></td><td><div class="input-group" style="margin-bottom:10px; width: 100%;"><input class="form-control" name=pwr'+c+' id=pwr'+c+' value=100><span class="input-group-addon"  style="width: 100px;">%</span></div></td></tr>');
              }

              // document.getElementById('fileInputGcode').value = '';
              // document.getElementById('fileInputDXF').value = '';
              // $('#generate').hide();
              // $('#dxfparamstomc').show();
              // $('#svgparamstomc').hide();
              // $('#cutParams').modal('toggle');
              // document.getElementById('fileName').value = fileName;
              viewExtents(dxfObject);
            };
      } else if (f.name.match(/.svg$/i)) {
            console.log(f.name + " is a SVG file");
            r.readAsText(evt.target.files[0]);
            r.onload = function(event) {
              svg = r.result
              console.log(svg);
              getSettings();
              drawSvg(svg);
            };

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
