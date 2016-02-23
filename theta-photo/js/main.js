var main = function() {

	// 
	var ua = {};
	ua.name 		= window.navigator.userAgent.toLowerCase();
	ua.isiPhone 	= ua.name.indexOf('iphone') >= 0;
	ua.isiPad 		= ua.name.indexOf('ipad') >= 0;
	ua.isAndroid 	= ua.name.indexOf('android') >= 0;

	// 
	var scene = new THREE.Scene();

	// 
	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 200 );
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

	// 
	var controls = (ua.isiPhone||ua.isiPad||ua.isAndroid) 
		? new THREE.DeviceOrientationControls(camera)
		: new THREE.OrbitControls(camera);

	// 
	var mesh = new THREE.Mesh( 
			new THREE.SphereGeometry( 300, 50, 30 ).scale(-1,1,1),
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load('textures/photo.jpg')
			})
	);
	mesh.position.set(0,0,0);
	scene.add( mesh );

	// 
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// 
	window.addEventListener( 'resize', function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

	// 
	( function renderLoop () {
		requestAnimationFrame( renderLoop );
		renderer.render( scene, camera );
		controls.update();
	} )();


}

