var main = function() {

	var radius = 50,
		camera,
		scene,
		controls,
		renderer,
		sphere, dot,
		lat = 45, lon = 45,
		phi, theta, 
		line;

	var $inputLat 	= $('[name="lat"]'),
		$inputLon 	= $('[name="lon"]'),
		$inputRad 	= $('[name="rad"]'),
		$txtLat 	= $('#txtLat'),
		$txtLon 	= $('#txtLon'),
		$txtRad 	= $('#txtRad'),
		$txtX 		= $('#txtX'),
		$txtY 		= $('#txtY'),
		$txtZ 		= $('#txtZ'),
		$txtPhi 	= $('#txtPhi'),
		$txtTheta 	= $('#txtTheta');

	// 
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setClearColor( 0xcccccc, 1.0 );

	// 
	scene = new THREE.Scene();

	// 
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 100,100,100 );
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

	//
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	scene.add(buildAxes());

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
	dot = new THREE.Mesh(
				new THREE.SphereGeometry( 2, 10, 10 ),
				new THREE.MeshBasicMaterial( {color:0x993300} )
			);
	scene.add( dot );

	// 
	theta = new THREE.Mesh(
				new THREE.CircleGeometry( 10, 20, 0, 0 ),
				new THREE.MeshBasicMaterial( {color:0x00ff00, side:THREE.DoubleSide} )
			);
	theta.rotation.x = - Math.PI * 0.5;
	scene.add( theta );

	// 
	phi = new THREE.Mesh(
				new THREE.CircleGeometry( 10, 20, 0, 0 ),
				new THREE.MeshBasicMaterial( {color:0x0000ff, side:THREE.DoubleSide} )
			);
	scene.add( phi );

	// 
	line = buildLine(translateGeoCoords(lat, lon, radius));
	scene.add(line);

	// 
	function update() {

		stats.update();
		
		var vec = translateGeoCoords(lat, lon, radius);

		lat = $inputLat.val();
		lon = $inputLon.val();
		radius = $inputRad.val();

		$txtLat.text(lat);
		$txtLon.text(lon);
		$txtRad.text(radius);
		$txtX.text(round(vec.x));
		$txtY.text(round(vec.y));
		$txtZ.text(round(vec.z));
		$txtPhi.text(	round(Math.atan2(vec.x, vec.y) * 180 / Math.PI));
		$txtTheta.text(	round(Math.atan2(vec.x, vec.z) * 180 / Math.PI));

		dot.position.set(vec.x, vec.y, vec.z);
		dot.lookAt(new THREE.Vector3(0,0,0));

		phi.geometry = new THREE.CircleGeometry( 10, 20, 0, lat%360*Math.PI/180 )
		phi.rotation.y = lon * Math.PI / 180;

		theta.geometry = new THREE.CircleGeometry( 10, 20, 0, lon%360*Math.PI/180 )

		//
		line.geometry.vertices[1] = vec;
		line.geometry.verticesNeedUpdate = true;

		renderer.render( scene, camera );
	}

	function buildLine(toVec, fromVec, color) {
		if (typeof fromVec === 'undefined') {
			fromVec = new THREE.Vector3(0,0,0);
		}
		if (typeof color === 'undefined') {
			color = 0x990000;
		}
		var geometry = new THREE.Geometry();
		geometry.vertices.push( fromVec ); 
		geometry.vertices.push( toVec ); 
		return new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: color} ) );
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
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

	function buildAxes() {

		function buildAxis( src, dst, colorHex, dashed ) {
			var geom = new THREE.Geometry(),
				mat; 
			if(dashed) {
				mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
			} else {
				mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
			}
			geom.vertices.push( src.clone() );
			geom.vertices.push( dst.clone() );
			var axis = new THREE.Line( geom, mat );
			return axis;
		}
	
		var axes = new THREE.Object3D();
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 100, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -100, 0, 0 ), 0x800000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 100, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -100, 0 ), 0x008000, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 100 ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -100 ), 0x000080, true ) ); // -Z
		return axes;
	
	}

	function round(val) {
		return Math.floor( val * 100 ) / 100
	}

	function distance(vec1, vec2) {
		var x1 = vec1.x, y1 = vec1.y, z1 = vec1.z;
		var x2 = vec2.x, y2 = vec2.y, z2 = vec2.z;
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
	}

}


