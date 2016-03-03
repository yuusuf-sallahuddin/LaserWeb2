$(document).ready(function() {
  init3D();
  animate();

  // File Open Button Combo
  $(":file").filestyle({input: false}, {size: "sm"}, {badge: false}); // Styled for firefox/chrome

  // Function to execute when opening file
  function readFile(evt) {
    var f = evt.target.files[0];
    if (f) {
      var r = new FileReader();
      if (f.name.match(/.dxf$/i)) {
    		    console.log(f.name + " is a DXF");
      } else if (f.name.match(/.svg$/i)) {
    		    console.log(f.name + " is a SVG");
      } else if (f.name.match(/.gcode$/i)) {
            console.log(f.name + " is a GCODE");
      }
    }

    };

  // Change Event
  var fileOpen = document.getElementById('file');
  fileOpen.addEventListener('change', readFile, false);

});
