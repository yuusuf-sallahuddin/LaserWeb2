var scene, camera, renderer;
var geometry, material, mesh, helper;

function init3D() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 395;


  if (helper) {
        scene.remove(helper);
  }

  var laserxmax = $('#laserXMax').val();
  var laserymax = $('#laserYMax').val();

  if (!laserxmax) {
    var laserxmax = 200;
  };

  if (!laserymax) {
    var laserymax = 200;
  };

console.log('Creating Gridhelper with X: ',laserxmax, ' and Y: ', laserymax )


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

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff, 1);  // Background color of viewer
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.clear();
  $('#renderArea').append(renderer.domElement);

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0, 0 ); // view direction perpendicular to XY-plane
  controls.enableRotate = false;
  controls.enableZoom = true; // optional
  controls.mouseButtons = { PAN: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, ORBIT: THREE.MOUSE.RIGHT }; // swapping left and right buttons

  var geometry = new THREE.BoxGeometry( 200, 200, 200 );
  var material = new THREE.MeshBasicMaterial({
                    color: 0xaa0000,
                });
}

function animate() {

      requestAnimationFrame( animate );
      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.02;
      renderer.render( scene, camera );
}

$(window).on('resize', function() {
  //renderer.setSize(element.width(), element.height());
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  controls.reset();
});

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
