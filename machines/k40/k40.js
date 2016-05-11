function k40() {

  var material = new THREE.MeshBasicMaterial( {color: 0x000088} );
  var reargeo = new THREE.BoxGeometry( 450, 10, 80 );
  var rear = new THREE.Mesh( reargeo, material );
  rear.position.y = (laserymax /2 ) + 45;
  rear.position.z = 30;
  scene.add( rear );
  edges = new THREE.EdgesHelper( rear, 0x0000ff );
  scene.add( edges );

  var frontgeo = new THREE.BoxGeometry( 450, 10, 30 );
  var front = new THREE.Mesh( frontgeo, material );
  front.position.y = -(laserymax /2 ) - 40;
  front.position.z = 5;
  scene.add( front );
  edges = new THREE.EdgesHelper( front, 0x0000ff );
  scene.add( edges );


  var sideleftgeo = new THREE.BoxGeometry( 10, 300, 80 );
  var sideleft = new THREE.Mesh( sideleftgeo, material );
  sideleft.position.x = -(laserxmax /2 ) - 70;
  sideleft.position.z = 30;
  scene.add( sideleft );
  edges = new THREE.EdgesHelper( sideleft, 0x0000ff );
  scene.add( edges );

  var siderightgeo = new THREE.BoxGeometry( 10, 300, 80 );
  var sideright = new THREE.Mesh( siderightgeo, material );
  sideright.position.x = (laserxmax /2 ) + 70;
  sideright.position.z = 30;
  scene.add( sideright );
  edges = new THREE.EdgesHelper( sideright, 0x0000ff );
  scene.add( edges );

  var psuboxgeo = new THREE.BoxGeometry( 160, 300, 80 );
  var psu = new THREE.Mesh( psuboxgeo, material );
  psu.position.x = (laserxmax /2 ) + 70 + 80;
  psu.position.z = 30;
  scene.add( psu );
  edges = new THREE.EdgesHelper( psu, 0x0000ff );
  scene.add( edges );

  var tubeboxgeo = new THREE.BoxGeometry( 605, 100, 80 );
  var tubebox = new THREE.Mesh( tubeboxgeo, material );
  tubebox.position.x = 77.5
  tubebox.position.y = (laserymax /2 ) + 40 + 50;
  tubebox.position.z = 30;
  scene.add( tubebox );
  edges = new THREE.EdgesHelper( tubebox, 0x0000ff );
  scene.add( edges );

  var basegeo = new THREE.BoxGeometry( 600, 390, 5 );
  var base = new THREE.Mesh( basegeo, material );
  base.position.x = 80;
  base.position.y = 45;
  base.position.z = -10;
  scene.add( base );

  var floormaterial = new THREE.MeshBasicMaterial( {color: 0xeeeeee} );
  var floorgeo = new THREE.BoxGeometry( 595, 380, 5 );
  var floor = new THREE.Mesh( floorgeo, floormaterial );
  floor.position.x = 80;
  floor.position.y = 50;
  floor.position.z = -5;
  scene.add( floor );

  var materialpanel = new THREE.MeshBasicMaterial( {color: 0xcccccc} );
  var psuboxpanel = new THREE.BoxGeometry( 130, 230, 1 );
  var psupanel = new THREE.Mesh( psuboxpanel, materialpanel );
  psupanel.position.x = (laserxmax /2 ) + 70 + 75;
  psupanel.position.y = -20;
  psupanel.position.z = 70;
  scene.add( psupanel );
  edges = new THREE.EdgesHelper( psu, 0x000000 );
  scene.add( psupanel );

  var loader = new THREE.TextureLoader();
  loader.load('machines/k40/panel.png', function ( texture ) {
    var geometry = new THREE.PlaneGeometry(130, 100, 1, 1);
    var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.95, overdraw: 0.5});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (laserxmax /2 ) + 70 + 72;
    mesh.position.y = -70;
    mesh.position.z = 71.5;
    scene.add(mesh);
  });
};

function k40defaults() {
  //'spjsip', 'laserXMax', 'laserYMax', 'startgcode', 'laseron', 'laseroff', 'lasermultiply', 'homingseq', 'endgcode', 'useOffset', 'imagePosition', 'useNumPad', 'useVideo', 'useProfile']
  $('#laserXMax').val('300');
  $('#laserYMax').val('200');
}
