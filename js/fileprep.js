function filePrepInit() {

  $( "#scaleFactor" ).change(function() {
    var hScale = ($(this).val() / 100);
    console.log('Scaling to ', hScale);
    fileObject.scale.x = hScale;
    fileObject.scale.y = hScale;
    // Scaling the vertices instead to allow offset to work
    // fileObject.traverse( function(child) {
    //   if (child.type == "Line") {
    //       child.geometry.vertices.scale(hScale, hScale, 1)
    //   };
    // });
    // fileObject.updateMatrix();
    fileObject.updateMatrix();
    fileObject.updateMatrixWorld();
    currentWorld();
  });

  $( "#xpos" ).change(function() {
    var hPosX = $(this).val();
    console.log('Moving X from ', fileObject.position.x   ,   ' to ',  (hPosX - (laserxmax / 2)) );
    fileObject.position.x = (hPosX - (laserxmax / 2));
    currentWorld();
  });

  $( "#ypos" ).change(function() {
    var hPosY = $(this).val();
    console.log('Moving X from ', fileObject.position.y   ,   ' to ',  (hPosY - (laserymax / 2)) );
    fileObject.position.y = (hPosY - (laserymax / 2));
    currentWorld();
  });

  $('#removeInflateGrp').on('click', function() {
    scene.remove(inflateGrp);
  });

}

//' Sets the input boxes to the current real-world sizes.  But why, well maybe we arent only going to scale/position via the input boxes?
// in which case we want to update the textboxes to match what we did from some other function'
function currentWorld() {
  $('#xpos').val(parseInt(fileObject.position.x) + (laserxmax / 2) );
  $('#ypos').val(parseInt(fileObject.position.y) + (laserymax / 2) );
  $('#scaleFactor').val((fileObject.scale.x) * 100);
}
