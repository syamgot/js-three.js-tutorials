var main = function() {

	var stats;

	var camera,
		scene,
		controls,
		renderer,
		views = [
			{x:0.0, y:0.0, w:0.5, h:1.0},
			{x:0.5, y:0.0, w:0.5, h:1.0}
		];

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
	var directionalLight = new THREE.DirectionalLight(0xdddddd);
	directionalLight.position.set(-5, 5, -5);
	directionalLight.color.multiplyScalar(0.5);
	scene.add( directionalLight );

	// make ambient light
	ambientLight = new THREE.AmbientLight(0xdddddd);
	ambientLight.color.multiplyScalar(0.3);
	scene.add( ambientLight );

	// update by frame
	function update() {
		render();
		stats.update();
		controls.update();
	}

	// 
	function render() {
		for (var i = 0; i < views.length; i++) {
			var view = views[i];
			var x = Math.floor( window.innerWidth  * view.x );
			var y = Math.floor( window.innerHeight * view.y );
			var w = Math.floor( window.innerWidth  * view.w );
			var h = Math.floor( window.innerHeight * view.h );
			renderer.setViewport( x,y,w,h );
			renderer.setScissor( x,y,w,h );
			renderer.setScissorTest( true );
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.render( scene, camera );
		}
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		update();
	})();





	scene.add(buildCube());
	scene.add(buildGrid());


	// 
	function buildCube() {
		var cube = new THREE.Mesh( 
				new THREE.CubeGeometry( 1,1,1 ),
				new THREE.MeshLambertMaterial({color: 0x6699ff} )
		);
		cube.position.set(0,0.5,0);
		return cube;
	}

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


