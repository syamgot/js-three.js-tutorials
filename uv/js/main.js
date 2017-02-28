/**
 * @see http://solutiondesign.com/blog/-/blogs/webgl-and-three-js-texture-mappi-1/
 */

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
	var directionalLight = new THREE.DirectionalLight(0xdddddd);
	directionalLight.position.set(-5, 5, -5);
	directionalLight.color.multiplyScalar(1);
	scene.add( directionalLight );

	// make ambient light
	ambientLight = new THREE.AmbientLight(0xdddddd);
	ambientLight.color.multiplyScalar(0.8);
	scene.add( ambientLight );

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





	scene.add(buildCube());
	scene.add(buildGrid());



	// 
	function buildCube() {
		var geometry = new THREE.CubeGeometry( 3, 3, 3);
		if (0) {
			var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
		}
		else if (0) {
			var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/crate.jpg') } );
		}
		else if (0) {
		    var materials = [
				new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/crate.jpg') } ),
				new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/bricks.jpg') } ),
				new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/clouds.jpg') } ),
				new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/stone-wall.jpg') } ),
				new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/water.jpg') } ),
				new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/wood-floor.jpg') } )
			];
			var material = new THREE.MeshFaceMaterial( materials );
		}
		else {
			var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('../data/textures/texture-atlas.jpg') } );
			var bricks = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
			var clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
			var crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
			var stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
			var water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
			var wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];
			geometry.faceVertexUvs[0] = [];
			geometry.faceVertexUvs[0][0] = [ bricks[0], bricks[1], bricks[3] ];
			geometry.faceVertexUvs[0][1] = [ bricks[1], bricks[2], bricks[3] ];
			geometry.faceVertexUvs[0][2] = [ clouds[0], clouds[1], clouds[3] ];
			geometry.faceVertexUvs[0][3] = [ clouds[1], clouds[2], clouds[3] ];
			geometry.faceVertexUvs[0][4] = [ crate[0], crate[1], crate[3] ];
			geometry.faceVertexUvs[0][5] = [ crate[1], crate[2], crate[3] ];
			geometry.faceVertexUvs[0][6] = [ stone[0], stone[1], stone[3] ];
			geometry.faceVertexUvs[0][7] = [ stone[1], stone[2], stone[3] ];
			geometry.faceVertexUvs[0][8] = [ water[0], water[1], water[3] ];
			geometry.faceVertexUvs[0][9] = [ water[1], water[2], water[3] ];
			geometry.faceVertexUvs[0][10] = [ wood[0], wood[1], wood[3] ];
			geometry.faceVertexUvs[0][11] = [ wood[1], wood[2], wood[3] ];
		}

		var cube = new THREE.Mesh(geometry, material );
		cube.position.set(0,1.5,0);
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


