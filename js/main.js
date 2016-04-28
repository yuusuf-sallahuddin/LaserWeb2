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
    macrosInit();
    grbl = new Grbl();
    //initRaster();

    // Tooltips
    $(document).tooltip();
    $(document).click(function() {
        $(this).tooltip("option", "hide", {
            effect: "clip",
            duration: 500
        }).off("focusin focusout");
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

    $('#macroEdit').editableTableWidget({
        preventColumns: [1, 4, 5, 6]
    });
    //$('#macroEdit').editableTableWidget();

    // // Show/Hide Macro Pad
    // $('#togglemacro').on('click', function() {
    //   printLog('Toggling Button Pad', msgcolor);
    //   $('#macro_container').toggle();
    //   $('#viewer_container').toggle();
    //   $('#renderArea').toggle();
    //   if ($( "#togglemacro" ).hasClass( "btn-primary" )) {
    //     $( "#togglemacro" ).removeClass( "btn-primary" )
    //     $( "#togglemacro" ).addClass( "btn-default" )
    //   } else {
    //     $( "#togglemacro" ).removeClass( "btn-default" )
    //     $( "#togglemacro" ).addClass( "btn-primary" )
    //   }
    // });

    // Show/Hide Macro Pad
    $('#togglemacro').on('click', function() {
        $('#macro_container').show();
        $('#viewer_container').hide();
        $('#control_container').hide();
        $('#file_container').hide();
        $('#settings_container').hide();
        $('#gcode_container').hide();
        $("#togglegcode").removeClass("btn-primary")
        $("#togglegcode").addClass("btn-default")
        $("#toggleviewer").removeClass("btn-primary")
        $("#toggleviewer").addClass("btn-default")
        $("#togglemachine").removeClass("btn-primary")
        $("#togglemachine").addClass("btn-default")
        $("#togglemacro").addClass("btn-primary")
        $("#togglemacro").removeClass("btn-default")
        $("#togglesettings").removeClass("btn-primary")
        $("#togglesettings").addClass("btn-default")
        $("#togglefile").removeClass("btn-primary")
        $("#togglefile").addClass("btn-default")
    });

    $('#toggleviewer').on('click', function() {
        $('#macro_container').hide();
        $('#viewer_container').show();
        $('#control_container').hide();
        $('#file_container').hide();
        $('#settings_container').hide();
        $('#gcode_container').hide();
        $("#togglegcode").removeClass("btn-primary")
        $("#togglegcode").addClass("btn-default")
        $("#toggleviewer").addClass("btn-primary")
        $("#toggleviewer").removeClass("btn-default")
        $("#togglemachine").removeClass("btn-primary")
        $("#togglemachine").addClass("btn-default")
        $("#togglemacro").removeClass("btn-primary")
        $("#togglemacro").addClass("btn-default")
        $("#togglesettings").removeClass("btn-primary")
        $("#togglesettings").addClass("btn-default")
        $("#togglefile").removeClass("btn-primary")
        $("#togglefile").addClass("btn-default")
    });

    $('#togglemachine').on('click', function() {
        $('#macro_container').hide();
        $('#viewer_container').hide();
        $('#control_container').show();
        $('#file_container').hide();
        $('#settings_container').hide();
        $('#gcode_container').hide();
        $("#togglegcode").removeClass("btn-primary")
        $("#togglegcode").addClass("btn-default")
        $("#toggleviewer").removeClass("btn-primary")
        $("#toggleviewer").addClass("btn-default")
        $("#togglemachine").addClass("btn-primary")
        $("#togglemachine").removeClass("btn-default")
        $("#togglemacro").removeClass("btn-primary")
        $("#togglemacro").addClass("btn-default")
        $("#togglesettings").removeClass("btn-primary")
        $("#togglesettings").addClass("btn-default")
        $("#togglefile").removeClass("btn-primary")
        $("#togglefile").addClass("btn-default")
    });

    $('#togglesettings').on('click', function() {
        $('#macro_container').hide();
        $('#viewer_container').hide();
        $('#control_container').hide();
        $('#file_container').hide();
        $('#settings_container').show();
        $('#gcode_container').hide();
        $("#togglegcode").removeClass("btn-primary")
        $("#togglegcode").addClass("btn-default")
        $("#toggleviewer").removeClass("btn-primary")
        $("#toggleviewer").addClass("btn-default")
        $("#togglemachine").removeClass("btn-primary")
        $("#togglemachine").addClass("btn-default")
        $("#togglemacro").removeClass("btn-primary")
        $("#togglemacro").addClass("btn-default")
        $("#togglesettings").addClass("btn-primary")
        $("#togglesettings").removeClass("btn-default")
        $("#togglefile").removeClass("btn-primary")
        $("#togglefile").addClass("btn-default")
    });

    $('#togglefile').on('click', function() {
        $('#macro_container').hide();
        $('#viewer_container').hide();
        $('#control_container').hide();
        $('#file_container').show();
        $('#settings_container').hide();
        $('#gcode_container').hide();
        $("#togglegcode").removeClass("btn-primary")
        $("#togglegcode").addClass("btn-default")
        $("#toggleviewer").removeClass("btn-primary")
        $("#toggleviewer").addClass("btn-default")
        $("#togglemachine").removeClass("btn-primary")
        $("#togglemachine").addClass("btn-default")
        $("#togglemacro").removeClass("btn-primary")
        $("#togglemacro").addClass("btn-default")
        $("#togglesettings").removeClass("btn-primary")
        $("#togglesettings").addClass("btn-default")
        $("#togglefile").addClass("btn-primary")
        $("#togglefile").removeClass("btn-default")
    });

    $('#togglegcode').on('click', function() {
        $('#macro_container').hide();
        $('#viewer_container').hide();
        $('#control_container').hide();
        $('#file_container').hide();
        $('#settings_container').hide();
        $('#gcode_container').show();
        $("#togglegcode").addClass("btn-primary")
        $("#togglegcode").removeClass("btn-default")
        $("#toggleviewer").removeClass("btn-primary")
        $("#toggleviewer").addClass("btn-default")
        $("#togglemachine").removeClass("btn-primary")
        $("#togglemachine").addClass("btn-default")
        $("#togglemacro").removeClass("btn-primary")
        $("#togglemacro").addClass("btn-default")
        $("#togglesettings").removeClass("btn-primary")
        $("#togglesettings").addClass("btn-default")
        $("#togglefile").removeClass("btn-primary")
        $("#togglefile").addClass("btn-default")
    });





    // Viewer

    var viewer = document.getElementById('renderArea');


    // Progressbar
    //NProgress.configure({ parent: '#consolemodule' });
    NProgress.configure({
        showSpinner: false
    });


});
// End of document.ready


// From here down we can have the actual functions

// Error handling
errorHandlerJS = function() {
    window.onerror = function(message, url, line) {
        message = message.replace(/^Uncaught /i, "");
        //alert(message+"\n\n("+url+" line "+line+")");
        console.log(message + "\n\n(" + url + " line " + line + ")");
        if (message.indexOf('updateMatrixWorld') == -1) { // Ignoring threejs messages, add more || as discovered
            printLog(message + "\n(" + url + " on line " + line + ")", errorcolor);
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
            console.log('Reader: ', r)
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
                $("#transformcontrols").hide();
            };
        } else if (f.name.match(/.stl$/i)) {
            //r.readAsText(evt.target.files[0]);
            // Remove the UI elements from last run
            cleanupThree();
            var stlloader = new MeshesJS.STLLoader;
            r.onload = function(event) {
                cleanupThree();
                // Parse ASCII STL
                if (typeof r.result === 'string') {
                    console.log("Inside STL.js Found ASCII");
                    stlloader.loadString(r.result);
                    return;
                }

                // buffer reader
                var view = new DataView(this.result);

                // get faces number
                try {
                    var faces = view.getUint32(80, true);
                } catch (error) {
                    self.onError(error);
                    return;
                }

                // is binary ?
                var binary = view.byteLength == (80 + 4 + 50 * faces);

                if (!binary) {
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
            $("#transformcontrols").hide();
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

                $('#stlopt').hide();
                $('#prepopt').hide();
                $("#transformcontrols").hide();

                //tbfleming's threejs texture code
                var img = document.getElementById('origImage');
                var imgwidth = img.naturalWidth;
                var imgheight = img.naturalHeight;

                var geometry = new THREE.PlaneBufferGeometry(imgwidth, imgheight, 1);

                var material = new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(event.target.result)
                });

                rastermesh = new THREE.Mesh(geometry, material);

                rastermesh.position.x = -(laserxmax / 2) + (imgwidth / 2);
                rastermesh.position.y = -(laserymax / 2) + (imgheight / 2);
                rastermesh.name = "rastermesh"

                scene.add(rastermesh);
                //  attachTransformWidget();
                resetView()
            };
        }
    }
    $('#filestatus').hide();
    $('#togglefile').click();
};

// Removed and null all object when a new file is loaded
function cleanupThree() {
    if (typeof(fileObject) !== 'undefined') {
        scene.remove(fileObject);
        fileObject = null;
    };

    if (typeof(rastermesh) !== 'undefined') {
        scene.remove(rastermesh);
        rastermesh = null;
    };

    if (typeof(inflateGrp) != 'undefined') {
        scene.remove(inflateGrp);
        inflateGrp = null;
    }

    if (typeof(slicegroup) != 'undefined') {
        scene.remove(slicegroup);
        slicegroup = null;
    }

    if (typeof(stl) != 'undefined') {
        scene.remove(stl);
        stl = null;
    }

    if (typeof(object) != 'undefined') {
        scene.remove(object);
        object = null;
    }

    if (typeof(fileParentGroup) != 'undefined') {
        scene.remove(fileParentGroup);
        fileParentGroup = null;
    }

    if (boundingBox) {
        scene.remove(boundingBox);
        boundingBox = null;
    }

    if (control) {
        scene.remove(control);
        controls.reset();
        //  boundingBox = null;
    }
}


function saveFile() {
    var textToWrite = document.getElementById("gcodepreview").value;
    var blob = new Blob([textToWrite], {type: "text/plain"});
    invokeSaveAsDialog(blob, 'file.gcode');

};


/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "image.png"
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        file.type = 'text/plain';
    }

    var fileExtension = file.type.split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function() {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}
function printLog(text, color) {
    $('#console').append('<p class="pf" style="color: ' + color + ';">' + text);
    $('#console').scrollTop($("#console")[0].scrollHeight - $("#console").height());
};
