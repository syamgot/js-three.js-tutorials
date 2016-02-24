var main = function() {

	var range = 100,
		camera,
		scene,
		controls,
		renderer,
		geom,
		cubes,
		mouseVector,
		projector;

	// 
	scene = new THREE.Scene();

	// 
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0,0,range*2 );
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

	//
	controls = new THREE.OrbitControls(camera);

	// 
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setClearColor( 0xeeeeee, 1.0 );

	// 
	window.addEventListener( 'resize', function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

	//
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	// 
	geom = new THREE.CubeGeometry( 5, 5, 5 );
	cubes = new THREE.Object3D();
	scene.add( cubes );
	for(var i = 0; i < 100; i++ ) {
		var grayness = Math.random() * 0.5 + 0.25,
			mat = new THREE.MeshBasicMaterial(),
			cube = new THREE.Mesh( geom, mat );
		mat.color.setRGB( grayness, grayness, grayness );
		cube.position.set( range * (0.5 - Math.random()), range * (0.5 - Math.random()), range * (0.5 - Math.random()) );
		cube.rotation.setFromVector3(new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar( 2 * Math.PI ));
		cube.grayness = grayness;
		cubes.add( cube );
	}

	// 
	projector 	= new THREE.Projector();
	mouseVector = new THREE.Vector3();

	// mousemove event handler
	function onMouseMove(e) {
		event.preventDefault();
		var raycaster 	= new THREE.Raycaster();
		var mouse 		= new THREE.Vector2();
		mouse.x 		= (event.clientX / renderer.domElement.width) * 2 -1;
		mouse.y 		= - (event.clientY / renderer.domElement.height) * 2 +1;
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(cubes.children);

		cubes.children.forEach(function( cube ) {
			cube.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
		});
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ],
			obj = intersection.object;
			obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
		}
	}
	document.addEventListener( 'mousemove', onMouseMove, false);


	// initialize orientation controls 
	function initOrientationControls(e) {
		if (!e.alpha) {
			return;
		}
		controls = new THREE.DeviceOrientationControls(camera, true);
		window.removeEventListener('deviceorientation', initOrientationControls, true);
		window.addEventListener('deviceorientation', onDeviceOrientation, true);
	}
	window.addEventListener('deviceorientation', initOrientationControls, true);

	// deviceorientation event handler
	function onDeviceOrientation(e) {

		event.preventDefault();
		var raycaster 	= new THREE.Raycaster();
		raycaster.setFromCamera( new THREE.Vector2(), camera ); 
		var intersects = raycaster.intersectObjects(cubes.children);

		cubes.children.forEach(function( cube ) {
			cube.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
		});
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ],
			obj = intersection.object;
			obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
		}

	}


	// 
	function update() {
		stats.update();
		controls.update();
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		update();
	})();



}


