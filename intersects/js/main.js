var main = function() {

	var stats;

	var camera,
		scene,
		controls,
		renderer;

	var directionalLight,
		ambientLight;

	var spheres = [];

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
	camera.position.set( 0,0,0.1 );
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

	// controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);

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
		renderer.render( scene, camera );
		stats.update();
		controls.update();


		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( new THREE.Vector2(), camera ); 
		var intersects = raycaster.intersectObjects(spheres);
		console.log(intersects.length);

		spheres.forEach(function(sphere){
			sphere.material.color.setHex(sphere.colorHex);
		});
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ],
			obj = intersection.object;
			obj.material.color.setHex(0xff9966);
		}

	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		update();
	})();



	var sphere1 = buildSphere(0x6699ff, new THREE.Vector3(0,0,-10));
	var sphere2 = buildSphere(0x6699ff, new THREE.Vector3(0,1,-11));
	var sphere3 = buildSphere(0x6699ff, new THREE.Vector3(0,2,-12));
	scene.add(sphere1);
	scene.add(sphere2);
	scene.add(sphere3);
	spheres.push(sphere1);
	spheres.push(sphere2);
	spheres.push(sphere3);
sphere2.visible = false;
	// 
	function buildSphere(color, vec) {
		var sphere = new THREE.Mesh( 
				new THREE.SphereGeometry( 10,30,30 ),
				new THREE.MeshLambertMaterial({color: color, transparent:true, opacity:0.8} )
		);
		sphere.position.set(vec.x, vec.y, vec.z);
		sphere.scale.set(0.1, 0.1, 0.1);
		sphere.colorHex = color;
		return sphere;
	}


}


