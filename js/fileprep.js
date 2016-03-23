function filePrepInit() {


  useOffset = $('#useOffset').val()
  if ( useOffset.indexOf('Disable') == 0 ) {
      $('#inflateFeature').hide();
  }



  $( "#scaleFactor" ).change(function() {
    if ( typeof(object) != 'undefined' ) {
      scene.remove(object);
    }
    var hScale = ($(this).val() / 100);
    console.log('Scaling to ', hScale);
    fileParentGroup.scale.x = hScale;
    fileParentGroup.scale.y = hScale;
    fileParentGroup.updateMatrix();
    fileParentGroup.updateMatrixWorld();
    putFileObjectAtZero();
    currentWorld();

  });

  $( "#xpos" ).change(function() {
    if ( typeof(object) != 'undefined' ) {
      scene.remove(object);
    }
    var hPosX = $(this).val();
    console.log('Moving X from ', fileObject.position.x   ,   ' to ',  (hPosX - (laserxmax / 2)) );
    fileParentGroup.position.x = (hPosX - (laserxmax / 2));
    currentWorld();
  });

  $( "#ypos" ).change(function() {
    if ( typeof(object) != 'undefined' ) {
      scene.remove(object);
    }
    var hPosY = $(this).val();
    console.log('Moving X from ', fileObject.position.y   ,   ' to ',  (hPosY - (laserymax / 2)) );
    fileParentGroup.position.y = (hPosY - (laserymax / 2));
    currentWorld();
  });

  $('#removeInflateGrp').on('click', function() {
    scene.remove(inflateGrp);
  });

}

//' Sets the input boxes to the current real-world sizes.  But why, well maybe we arent only going to scale/position via the input boxes?
// in which case we want to update the textboxes to match what we did from some other function'
function currentWorld() {
  $('#xpos').val(parseInt(fileParentGroup.position.x) + (laserxmax / 2) );
  $('#ypos').val(parseInt(fileParentGroup.position.y) + (laserymax / 2) );
  $('#scaleFactor').val((fileParentGroup.scale.x) * 100);
}

function putFileObjectAtZero() {
  // var bbox = new THREE.Box3().setFromObject(fileParentGroup);
  // console.log('bbox for putFileObjectAtZero: Min X: ', (bbox.min.x + (laserxmax / 2) ), '  Max X:', (bbox.max.x + (laserxmax / 2) ), 'Min Y: ', (bbox.min.y + (laserymax / 2) ), '  Max Y:', (bbox.max.y + (laserymax / 2) ) );
  // fileParentGroup.translateX( - (bbox.min.x + (laserxmax / 2))  );
  // fileParentGroup.translateY( - (bbox.min.y + (laserymax / 2))  );
  currentWorld();
}

function putInflateGrpAtZero() {
  if (yflip == true) {
    inflateGrp.position.x = fileParentGroup.position.x
    inflateGrp.position.y = - fileParentGroup.position.y
  } else {
    inflateGrp.position.x = fileParentGroup.position.x
    inflateGrp.position.y = fileParentGroup.position.y
  };
// var bbox = new THREE.Box3().setFromObject(inflateGrp);
// console.log('bbox for putFileObjectAtZero: inflate:  Min X: ', (bbox.min.x + (laserxmax / 2) ), '  Max X:', (bbox.max.x + (laserxmax / 2) ), 'Min Y: ', (bbox.min.y + (laserymax / 2) ), '  Max Y:', (bbox.max.y + (laserymax / 2) ) );
// var bbox2 = new THREE.Box3().setFromObject(fileParentGroup);
// console.log('bbox for putFileObjectAtZero: file: Min X: ', (bbox2.min.x + (laserxmax / 2) ), '  Max X:', (bbox2.max.x + (laserxmax / 2) ), 'Min Y: ', (bbox2.min.y + (laserymax / 2) ), '  Max Y:', (bbox2.max.y + (laserymax / 2) ) );
//
// var offset = parseFloat($('#inflateVal').val());
// var xmove = parseFloat($('#xpos').val());
// var ymove = parseFloat($('#ypos').val());
//
// if (svgxpos > 0) {
//   inflateGrp.translateX( - (bbox.min.x + (laserxmax / 2) + xmove)  );
//   inflateGrp.translateY( - (bbox.min.y + (laserymax / 2) + ymove)  );
// } else {
//   inflateGrp.translateX( - (bbox.min.x + (laserxmax / 2))  );
//   inflateGrp.translateY( - (bbox.min.y + (laserymax / 2))  );
// };
// // inflateGrp.position.x = (offset -(laserxmax / 2));
// // inflateGrp.position.y = (offset -(laserymax / 2));
//
// if (svgxpos > 0) {
//   fileParentGroup.position.x = offset;
//   fileParentGroup.position.y = offset;
// } else {
//   fileParentGroup.position.x = (offset - (laserxmax / 2));
//   fileParentGroup.position.y = (offset - (laserymax / 2));
//   // fileParentGroup.translateX( - (bbox2.min.x + (laserxmax / 2) - offset - xmove)  );
//   // fileParentGroup.translateY( - (bbox2.min.y + (laserymax / 2) - offset - ymove)  );
// };
// currentWorld();

}
