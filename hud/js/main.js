/**
 * @see http://shin.hateblo.jp/entry/2013/12/11/135742
 * @see http://stackoverflow.com/questions/12667507/drawing-ui-elements-directly-to-the-webgl-area-with-three-js
 *
 */
var main = function() {

	var renderer,
		scene, camera, controls,
		sceneHud, cameraHud,
		sprite;

	var width 	= window.innerWidth;
	var height 	= window.innerHeight;

	//
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height );
	renderer.autoClear = false;
	document.body.appendChild( renderer.domElement );

	//
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );




	(function init3D(){

		// 
		scene = new THREE.Scene();
	
		// 
		camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
		camera.position.set( 10, 10, 10 );
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		controls = new THREE.OrbitControls(camera);
	
		// 
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/collada/negimiku/negimiku.dae', function ( collada ) {
			var dae = collada.scene;
			dae.scale.x = dae.scale.y = dae.scale.z = 0.1;
			dae.position.y = 1;
			dae.updateMatrix();
			scene.add( dae );
		});

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

		scene.add(buildGrid());
		scene.add(buildAxes());

	}());




	(function initHud(){

		cameraHud 	= new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );
		sceneHud 	= new THREE.Scene();

		// We will use 2D canvas element to render our HUD.  
		var hudCanvas = document.createElement('canvas');

		// Again, set dimensions to fit the screen.
		hudCanvas.width 	= width;
		hudCanvas.height 	= height;

		// Get 2D context and draw something supercool.
		var hudBitmap 		= hudCanvas.getContext('2d');
		hudBitmap.font 		= "Normal 40px Arial";
		hudBitmap.textAlign = 'center';
		hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
		hudBitmap.fillText('Initializing...', width / 2, height / 2);

		// Create the camera and set the viewport to match the screen dimensions.
		cameraHud = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

		// Create also a custom scene for HUD.
		sceneHud = new THREE.Scene();
 
		// Create texture from rendered graphics.
		var hudTexture = new THREE.Texture(hudCanvas) 
		hudTexture.needsUpdate = true;
  
		// Create HUD material.
		var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
		material.transparent = true;

		// Create plane to render the HUD. This plane fill the whole screen.
		var planeGeometry = new THREE.PlaneGeometry( width, height );
		var plane = new THREE.Mesh( planeGeometry, material );
		sceneHud.add( plane );

	}());




	// 
	function update() {
		renderer.render( scene, camera );
		renderer.render( sceneHud, cameraHud );
		stats.update();
		controls.update();
	}

	// 
	(function animate() {
		requestAnimationFrame( animate );
		update();
	})();









	function buildGrid() {
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
		return new THREE.LineSegments( geometry, material );
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


}

