var scene, camera, renderer;
var geometry, material, mesh, helper;

function init3D() {

   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
   camera.position.z = 395;



   if (helper) {
          scene.remove(helper);
      }

    helper = new THREE.GridHelper(800, 10);
              helper.setColors(0x0000ff, 0x707070);
              helper.position.y = 0;
              helper.position.x = 0;
              helper.position.z = 0;
              helper.rotation.x = 90 * Math.PI / 180;
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
}

function animate() {

      requestAnimationFrame( animate );

      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.02;

      renderer.render( scene, camera );

  }
