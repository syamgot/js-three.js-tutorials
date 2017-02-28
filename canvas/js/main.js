var main = function() {

	var stats;

	var camera,
		scene,
		controls,
		renderer;

	var directionalLight,
		ambientLight;

	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// window resize event handler
	window.addEventListener( 'resize', function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

	// scene
	scene = new THREE.Scene();

	// camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 10,10,10 );
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

	// controls
	controls = new THREE.OrbitControls(camera);

	// make directional light
//	var directionalLight = new THREE.DirectionalLight(0xdddddd);
//	directionalLight.position.set(-5, 5, -5);
//	directionalLight.color.multiplyScalar(0.5);
//	scene.add( directionalLight );

	// make ambient light
//	ambientLight = new THREE.AmbientLight(0xdddddd);
//	ambientLight.color.multiplyScalar(0.3);
//	scene.add( ambientLight );

	// update by frame
	function update() {
		renderer.render( scene, camera );
		stats.update();
		controls.update();
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		update();
	})();



	var canvas 			= document.createElement('canvas');
	canvas.width 		= 512;
	canvas.height 		= 256;

	var context 		= canvas.getContext('2d');
	context.font 		= "16px Arial";
	context.fillStyle 	= "rgba(255,255,255,0.5)";
	context.fillRect(0,0,512,256);
	context.fillStyle 	= "rgba(0,0,0,0.95)";
    context.fillText('Hello, world!', 0, 50);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
      
    var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
    // material.transparent = true;

    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas.width, canvas.height),
        material
      );
	mesh.position.set(0,0,0);
	mesh.scale.set(0.01,0.01,0.01);
	scene.add( mesh );




	scene.add(buildGrid());

	// grid
	function buildGrid() {
		var size = 14, step = 1;
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial( { color: 0x606060 } );
		for ( var i = - size; i <= size; i += step ) {
			geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
			geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );
			geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
			geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );
		}
		return new THREE.LineSegments( geometry, material );
	}

}


