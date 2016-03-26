var scene, camera, renderer;
var geometry, material, mesh, helper, axes, axesgrp, light;


// Global Vars
var container, stats;
var camera, controls, scene, renderer;
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
 raycaster.linePrecision = 0.1;
var projector = new THREE.Projector();
var directionVector = new THREE.Vector3();
var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = window.innerWidth;
 var INTERSECTED;
var clickInfo = {
  x: 0,
  y: 0,
  userHasClicked: false
};
//var statsNode = document.getElementById('stats');
var marker;
var laserxmax;
var laserymax;
var lineincrement = 50

function init3D() {

// ThreeJS Render/Control/Camera
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 295;

// var userAgent = navigator.userAgent || navigator.vendor || window.opera;
//
// if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
// {
//       console.log('Running on iOS');
//       renderer = new THREE.WebGLRenderer();
// }
//     else if( userAgent.match( /Android/i ) )
// {
//     console.log('Running on Android');
//     renderer = new THREE.CanvasRenderer();
// }
//   else
// {
//     console.log('Running on unknown/Desktop');
//     renderer = new THREE.WebGLRenderer();
// }

var canvas = !! window.CanvasRenderingContext2D;
var webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();

if (webgl) {
    printLog('<h5>WebGL Support found!</h5><b>success:</b><br> Laserweb will work optimally on this device!', '#000000');
    renderer = new THREE.WebGLRenderer({
        autoClearColor: true
    });

} else if (canvas) {
    printLog('<h5>No WebGL Support found!</h5><b>CRITICAL ERROR:</b><br> Laserweb may not work optimally on this device! <br>Try another device with WebGL support</p><br><u>Try the following:</u><br><ul><li>In the Chrome address bar, type: <b>chrome://flags</b> [Enter]</li><li>Enable the <b>Override software Rendering</b></li><li>Restart Chrome and try again</li></ul>Sorry! :(<hr>', '#000000');
    renderer = new THREE.CanvasRenderer();
};



var userAgent = navigator.userAgent || navigator.vendor || window.opera;

if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
{
      console.log('Running on iOS');
      $('#viewermodule').show();
      $('#mobileRenderArea').append(renderer.domElement);
      renderer.setClearColor(0xffffff, 1);  // Background color of viewer
      renderer.setSize( 1000 , 1000 );
      renderer.clear();
      camera.aspect = $('#mobileRenderArea').width() / $('#mobileRenderArea').height();
      camera.updateProjectionMatrix();

}
    else if( userAgent.match( /Android/i ) )
{
    console.log('Running on Android');
    $('#viewermodule').show();
    $('#mobileRenderArea').append(renderer.domElement);
    renderer.setClearColor(0xffffff, 1);  // Background color of viewer
    renderer.setSize($('#mobileRenderArea').width(), $('#mobileRenderArea').height());
    renderer.clear();
    camera.aspect = $('#mobileRenderArea').width() / $('#mobileRenderArea').height();
    camera.updateProjectionMatrix();

}
  else
{
    console.log('Running on unknown/Desktop');
    $('#viewermodule').hide();
    $('#renderArea').append(renderer.domElement);
    renderer.setClearColor(0xffffff, 1);  // Background color of viewer
    renderer.setSize( window.innerWidth -10, window.innerHeight -10 );
    renderer.clear();

}



controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 ); // view direction perpendicular to XY-plane
//controls.enableRotate = false;
controls.enableZoom = true; // optional
//controls.mouseButtons = { PAN: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, ORBIT: THREE.MOUSE.RIGHT }; // swapping left and right buttons
// /var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };


// LaserWEB UI Grids
if (helper) {
        scene.remove(helper);
}

laserxmax = $('#laserXMax').val();
laserymax = $('#laserYMax').val();

if (!laserxmax) {
    laserxmax = 200;
};

if (!laserymax) {
    laserymax = 200;
};

helper = new THREE.GridHelper(laserxmax, laserymax, 10);
              helper.setColors(0x0000ff, 0x707070);
              helper.position.y = 0;
              helper.position.x = 0;
              helper.position.z = 0;
              //helper.rotation.x = 90 * Math.PI / 180;
              helper.material.opacity = 0.15;
              helper.material.transparent = true;
              helper.receiveShadow = false;
              //console.log("helper grid:", helper);
              this.grid = helper;
              //this.sceneAdd(this.grid);
  //console.log('[VIEWER] - added Helpert');
scene.add(helper);

var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 1, 1 ).normalize();
  scene.add(light);



if (axesgrp) {
    scene.remove(axesgrp);
}
axesgrp = new THREE.Object3D();

var x = [];
var y = [];
for (var i = 0; i <= laserxmax ; i+=lineincrement) {
     x[i] = this.makeSprite(this.scene, "webgl", {
       x: i,
       y: -14,
       z: 0,
       text: i,
       color: "#ff0000"
     });
     axesgrp.add(x[i]);
}

for (var i = 0; i <= laserymax ; i+=lineincrement) {

   y[i] = this.makeSprite(this.scene, "webgl", {
     x: -14,
     y: i,
     z: 0,
     text: i,
     color: "#006600"
   });
   axesgrp.add(y[i]);
}
   // add axes labels
var xlbl = this.makeSprite(this.scene, "webgl", {
     x: laserxmax,
     y: 0,
     z: 0,
     text: "X",
     color: "#ff0000"
});
var ylbl = this.makeSprite(this.scene, "webgl", {
     x: 0,
     y: laserymax,
     z: 0,
     text: "Y",
     color: "#006600"
});
var zlbl = this.makeSprite(this.scene, "webgl", {
     x: 0,
     y: 0,
     z: 125,
     text: "Z",
     color: "#0000ff"
});


axesgrp.add(xlbl);
axesgrp.add(ylbl);
//axesgrp.add(zlbl); Laser don't have Z - but CNCs do

var materialX = new THREE.LineBasicMaterial({
	color: 0xcc0000
});

var materialY = new THREE.LineBasicMaterial({
  color: 0x00cc00
});

var geometryX = new THREE.Geometry();
geometryX.vertices.push(
	   new THREE.Vector3( 0, 0, 0 ),
	   new THREE.Vector3( 0, (laserymax - 5), 0 )
);

var geometryY = new THREE.Geometry();
geometryY.vertices.push(
	   new THREE.Vector3( 0, 0, 0 ),
	   new THREE.Vector3( (laserxmax -5), 0, 0 )
);

var line1 = new THREE.Line( geometryX, materialY );
var line2 = new THREE.Line( geometryY, materialX );
axesgrp.add( line1 );
axesgrp.add( line2 );

axesgrp.translateX(laserxmax /2 * -1);
axesgrp.translateY(laserymax /2 * -1);
//console.log('[VIEWER] - added Axesgrp');
scene.add(axesgrp);

}

function animate() {

  requestAnimationFrame( animate );

  checkIntersects();

      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.02;
      renderer.render( scene, camera );
}

checkIntersects = function () {
  if (clickInfo.userHasClicked) {
    // /console.log('Had a click');
    clickInfo.userHasClicked = false;
    //statsNode.innerHTML = '';
    // The following will translate the mouse coordinates into a number
    // ranging from -1 to 1, where
    //      x == -1 && y == -1 means top-left, and
    //      x ==  1 && y ==  1 means bottom right
    var x = ( clickInfo.x / SCREEN_WIDTH ) * 2 - 1;
    var y = -( clickInfo.y / SCREEN_HEIGHT ) * 2 + 1;
    console.log('clicked on ',x, ' ', y)
    // Now we set our direction vector to those initial values
    //directionVector.set(x, y, 1);
    // Unproject the vector
    projector.unprojectVector(directionVector, camera);
    // Substract the vector representing the camera position
    directionVector.sub(camera.position);
    // Normalize the vector, to avoid large numbers from the
    // projection and substraction
    directionVector.normalize();
    // Now our direction vector holds the right numbers!
    raycaster.set(camera.position, directionVector);
    // Ask the raycaster for intersects with all objects in the scene:
    // (The second arguments means "recursive")
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length) {
       var target = intersects[0].object;
       console.log('Name: ' + target.name + '<br>' + 'ID: ' + target.id);
    };
  };
};


viewExtents = function (objecttosee) {
  //console.log("viewExtents. object.userData:", this.object.userData);
  console.log("controls:", controls);
  //wakeAnimate();

  // lets override the bounding box with a newly
  // generated one
  // get its bounding box
  var helper = new THREE.BoundingBoxHelper(objecttosee, 0xff0000);
  helper.update();
  //if (this.bboxHelper)
  //    this.scene.remove(this.bboxHelper);
  bboxHelper = helper;
  // If you want a visible bounding box
  //this.scene.add(this.bboxHelper);
  console.log("helper bbox:", helper);

  var minx = helper.box.min.x;
  var miny = helper.box.min.y;
  var maxx = helper.box.max.x;
  var maxy = helper.box.max.y;
  var minz = helper.box.min.z;
  var maxz = helper.box.max.z;

  // var ud = [];
  // ud.bbox2 = helper.box;
  // ud.center2.x = minx + ((maxx - minx) / 2);
  // ud.center2.y = miny + ((maxy - miny) / 2);
  // ud.center2.z = minz + ((maxz - minz) / 2);

  //this.controls.enabled = false;
  controls.reset();
  //this.controls.object.rotation._x = 0.5;
  //this.controls.object.rotation._y = 0.5;
  //this.controls.object.rotation._z = 0.5;
  //this.controls.object.rotation = THREE.Euler(0.5, 0.5, 0.5);
  //this.controls.object.setRotationFromEuler(THREE.Euler(0.5,0.5,0.5));

  // get max of any of the 3 axes to use as max extent
  //var lenx = Math.abs(ud.bbbox2.min.x) + ud.bbbox2.max.x;
  //var leny = Math.abs(ud.bbbox2.min.y) + ud.bbbox2.max.y;
  //var lenz = Math.abs(ud.bbbox2.min.z) + ud.bbbox2.max.z;
  var lenx = maxx - minx;
  var leny = maxy - miny;
  var lenz = maxz - minz;
  var centerx = minx + (lenx / 2);
  var centery = miny + (leny / 2);
  var centerz = minz + (lenz / 2);


  console.log("lenx:", lenx, "leny:", leny, "lenz:", lenz);
  var maxlen = Math.max(lenx, leny, lenz);
  var dist = 2 * maxlen;
  // center camera on gcode objects center pos, but twice the maxlen
  controls.object.position.x = centerx;
  controls.object.position.y = centery;
  controls.object.position.z = centerz + dist;
  controls.target.x = centerx;
  controls.target.y = centery;
  controls.target.z = centerz;
  console.log("maxlen:", maxlen, "dist:", dist);
  var fov = 2.2 * Math.atan(maxlen / (2 * dist)) * (180 / Math.PI);
  console.log("new fov:", fov, " old fov:", controls.object.fov);
  if (isNaN(fov)) {
      console.log("giving up on viewing extents because fov could not be calculated");
      return;
  }
  controls.object.fov = fov;
  //this.controls.object.setRotationFromEuler(THREE.Euler(0.5,0.5,0.5));
  //this.controls.object.rotation.set(0.5,0.5,0.5,"XYZ");
  //this.controls.object.rotateX(2);
  //this.controls.object.rotateY(0.5);

  var L = dist;
  var camera = controls.object;
  var vector = controls.target.clone();
  var l = (new THREE.Vector3()).subVectors(camera.position, vector).length();
  var up = camera.up.clone();
  var quaternion = new THREE.Quaternion();

  // Zoom correction
  camera.translateZ(L - l);
  console.log("up:", up);
  up.y = 1; up.x = 0; up.z = 0;
  quaternion.setFromAxisAngle(up, 0);
  //camera.position.applyQuaternion(quaternion);
  up.y = 0; up.x = 1; up.z = 0;
  quaternion.setFromAxisAngle(up, 0);
  camera.position.applyQuaternion(quaternion);
  up.y = 0; up.x = 0; up.z = 1;
  quaternion.setFromAxisAngle(up, 0);
  //camera.position.applyQuaternion(quaternion);

  camera.lookAt(vector);

  //this.camera.rotateX(90);

  controls.object.updateProjectionMatrix();
  //this.controls.enabled = true;
  //this.scaleInView();
  //this.controls.rotateCamera(0.5);
  //this.controls.noRoll = true;
  //this.controls.noRotate = true;
};

function colorobj(name) {
  var object = scene.getObjectByName( name, true );
  console.log(object)
  // for (i=0; i<dxfObject.children.length; i++) {
  //     dxfObject.children[i].material.color.setHex(0x000000);
  //     dxfObject.children[i].material.opacity = 0.3;
  // }
  object.material.color.setHex(0xFF0000);
  object.material.needsUpdate = true;
}


function makeSprite(scene, rendererType, vals) {
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      metrics = null,
      textHeight = 100,
      textWidth = 0,
      actualFontSize = 10;
  var txt = vals.text;
  if (vals.size) actualFontSize = vals.size;

  context.font = "normal " + textHeight + "px Arial";
  metrics = context.measureText(txt);
  var textWidth = metrics.width;

  canvas.width = textWidth;
  canvas.height = textHeight;
  context.font = "normal " + textHeight + "px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  //context.fillStyle = "#ff0000";
  context.fillStyle = vals.color;

  context.fillText(txt, textWidth / 2, textHeight / 2);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
	texture.minFilter = THREE.LinearFilter;

  var material = new THREE.SpriteMaterial({
      map: texture,
      useScreenCoordinates: false,
      transparent: true,
      opacity: 0.6
  });
  material.transparent = true;
  //var textObject = new THREE.Sprite(material);
  var textObject = new THREE.Object3D();
  textObject.position.x = vals.x;
  textObject.position.y = vals.y;
  textObject.position.z = vals.z;
  var sprite = new THREE.Sprite(material);
  textObject.textHeight = actualFontSize;
  textObject.textWidth = (textWidth / textHeight) * textObject.textHeight;
  if (rendererType == "2d") {
      sprite.scale.set(textObject.textWidth / textWidth, textObject.textHeight / textHeight, 1);
  } else {
      sprite.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);
  }

  textObject.add(sprite);

  //scene.add(textObject);
  return textObject;
}


// Global Function to keep three fullscreen
$(window).on('resize', function() {
  //renderer.setSize(element.width(), element.height());
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  controls.reset();
  $('#viewReset').click();

});
