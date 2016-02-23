var main = function() {

	// 
	var scene = new THREE.Scene();

	// 
	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 2, 2, 3 );
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	var controls = new THREE.OrbitControls(camera);


	// grid
	var size = 14, step = 1;
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );
	}
	var grid = new THREE.LineSegments( geometry, material );
	scene.add( grid );

	// 
	var filePath = './models/collada/negimiku/negimiku.dae';
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( filePath, function ( collada ) {
		var dae = collada.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 0.1;
		dae.position.y = 1;
		dae.updateMatrix();
		scene.add( dae );
	});

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
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.x = 2;
	directionalLight.position.y = 2;
	directionalLight.position.z = 2;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	// 
	var ambientLight = new THREE.AmbientLight(0x404040);
	ambientLight.color.multiplyScalar(1); 
	scene.add( ambientLight );

	//
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	// 
	var clock = new THREE.Clock();
	function update() {
		var timer = Date.now() * 0.0005;
		camera.position.x = Math.cos( timer ) * 10;
		camera.position.y = 2;
		camera.position.z = Math.sin( timer ) * 10;
		camera.lookAt( scene.position );
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		update();
		stats.update();
		controls.update();
	})();

}

