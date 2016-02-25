var main = function() {

	var radius = 50,
		camera,
		scene,
		controls,
		renderer,
		sphere, planes = [],
		planeGeos = [],
		planeGeoAccs = [{lat:1,lon:0},{lat:0,lon:1}];	

	// 
	scene = new THREE.Scene();

	// 
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0,0,radius*3 );
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
	sphere = new THREE.Mesh(
				new THREE.SphereGeometry( radius, 10, 10 ),
				new THREE.MeshBasicMaterial( {color:0x999999, wireframe: true} )
			);
	scene.add( sphere );

	function buildPlane() {
		return new THREE.Mesh( 
					new THREE.PlaneGeometry( 10, 10 ),
					new THREE.MeshBasicMaterial( {color:0x999999, wireframe: true} )
				);
	}

	for (var i = 0; i < planeGeoAccs.length; i++) {
		var plane = buildPlane();
		planes.push(plane);
		planeGeos.push({lat:0,lon:0});
		scene.add(plane);
	}

	// initialize orientation controls 
	function initOrientationControls(e) {
		if (!e.alpha) {
			return;
		}
		controls = new THREE.DeviceOrientationControls(camera, true);
		window.removeEventListener('deviceorientation', initOrientationControls, true);
	}
	window.addEventListener('deviceorientation', initOrientationControls, true);

	// 
	function update() {
		stats.update();
		controls.update();

		for (var i = 0; i < planeGeoAccs.length; i++) {
			planeGeos[i].lat += planeGeoAccs[i].lat;
			planeGeos[i].lon += planeGeoAccs[i].lon;
			var vec = translateGeoCoords(planeGeos[i].lat, planeGeos[i].lon, radius);
			planes[i].position.set(vec.x, vec.y, vec.z);
			planes[i].lookAt(new THREE.Vector3(0,0,0));
		}

	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		update();
	})();

	/**
	 *
	 */
	function translateGeoCoords(lat, lon, radius) {
		var phi = (lat) * Math.PI / 180;
		var theta = (lon - 180) * Math.PI / 180;
		var x = -(radius) * Math.cos(phi) * Math.cos(theta);
		var y = (radius) * Math.sin(phi);
		var z = (radius) * Math.cos(phi) * Math.sin(theta);
		return new THREE.Vector3(x, y, z);
	}

}


