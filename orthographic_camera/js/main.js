var main = function() {

	var cameraL,
		cameraR,
		scene,
		controls,
		renderer,
		geom,
		lx,ly,lz,
		rx,ry,rz;

	var width = window.innerWidth,
		height = window.innerHeight;

	//
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	// 
	scene = new THREE.Scene();

	// 
	lx = ly = lz = 30;
	cameraL = new THREE.PerspectiveCamera( 45, (width / height)*0.5, 0.1, 2000 );
	cameraL.position.set( lx,ly,lz );
	cameraL.lookAt(new THREE.Vector3( 0, 0, 0 ));

	//
	rx = ry = rz = 1;
	cameraR = new THREE.OrthographicCamera( (width/-2)*0.5, (width/2)*0.5, height / 2, height / - 2, 0.1, 2000 );
	cameraR.zoom = 20;
	cameraR.position.set( rx,ry,rz );
	cameraR.updateProjectionMatrix();
	cameraR.lookAt(new THREE.Vector3( 0, 0, 0 ));

	// 
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height );
	renderer.autoClear = false;
	document.body.appendChild( renderer.domElement );

	// 
	function update() {

		var timer = Date.now() * 0.0005;

		stats.update();

		renderer.setViewport( 0, 0, width, height );
		renderer.clear(); 

		// left camera rendering
		renderer.setViewport( 0,0,width*0.5,height );
		renderer.render( scene, cameraL );

		cameraL.position.x = Math.cos( timer ) * lx;
		cameraL.position.y = ly;
		cameraL.position.z = Math.sin( timer ) * lz;
		cameraL.updateProjectionMatrix();
		cameraL.lookAt( scene.position );

		// right camera rendering
		renderer.setViewport( width*0.5,0,width*0.5,height );
		renderer.render( scene, cameraR );     

		cameraR.position.x = Math.cos( timer ) * rx;
		cameraR.position.y = ry;
		cameraR.position.z = Math.sin( timer ) * rz;
		cameraR.updateProjectionMatrix();
		cameraR.lookAt( scene.position );
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		update();
	})();

	// 
	geom = new THREE.CubeGeometry( 5, 5, 5 );
	mat = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	cube = new THREE.Mesh( geom, mat );
	cube.position.set(0,0,-0);
	scene.add(cube);

	geom = new THREE.CubeGeometry( 5, 10, 5 );
	mat = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	cube = new THREE.Mesh( geom, mat );
	cube.position.set(-5,2.5,-0);
	scene.add(cube);

	geom = new THREE.CubeGeometry( 5, 5, 5 );
	mat = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	cube = new THREE.Mesh( geom, mat );
	cube.position.set(5,0,-5);
	scene.add(cube);

	// 
	window.addEventListener( 'resize', function(){
		width 			= window.innerWidth;
		height 			= window.innerHeight;
		camera.aspect 	= width / height;
		camera.left 	= width/-2;
		camera.right 	= width/2;
		camera.top 		= height/2;
		camera.bottom 	= height/-2;
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	}, false );

	//
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(2,2,2);
	directionalLight.position.normalize();
	scene.add( directionalLight );

	// 
	var ambientLight = new THREE.AmbientLight(0x404040);
	ambientLight.color.multiplyScalar(1); 
	scene.add( ambientLight );

}


