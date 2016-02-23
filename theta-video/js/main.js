var main = function() {

	var camera, scene, renderer, texture;

	var video;
	
	var isUserInteracting = false;
	var onMouseDownMouseX = 0; 
	var onMouseDownMouseY = 0;
	var lon = 0; 
	var onMouseDownLon = 0;
	var lat = 0; 
	var onMouseDownLat = 0;
	var phi = 0; 
	var theta = 0;
	var fov = 75;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var aspect = width / height;
	var near  = 1;
	var far = 1100;
	
	init();
	animate();
	
	function init() {
	
		var container, mesh;
	
		// 描画領域?
		container = document.getElementById( 'container' );
	
		// カメラをセットアップ
		camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
		camera.target = new THREE.Vector3( 0, 0, 0 );
	
		// シーンをセットアップ
		scene = new THREE.Scene();
	
		// ジオメトリ(形状)をセットアップ
		var geometry = new THREE.SphereGeometry( 500, 60, 40 );
		geometry.scale( - 1, 1, 1 );

		// テクスチャの準備
//		texture = new THREE.TextureLoader().load('textures/sample.jpg');
		video = document.getElementById( 'video' );
		texture = new THREE.VideoTexture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;

		// マテリアル(素材)をセットアップ
		var material = new THREE.MeshBasicMaterial( {map: texture} );
	
		// メッシュを作成
		mesh = new THREE.Mesh( geometry, material );
		
		// メッシュを設置
		scene.add( mesh );
	
		// レンダラーをDOM上に設置する
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		container.appendChild( renderer.domElement );

		// イベントリスナ
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
		document.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);
	
		//
		document.addEventListener( 'dragover', function ( event ) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'copy';
		}, false );
	
		document.addEventListener( 'dragenter', function ( event ) {
			document.body.style.opacity = 0.5;
		}, false );
	
		document.addEventListener( 'dragleave', function ( event ) {
			document.body.style.opacity = 1;
		}, false );
	
		document.addEventListener( 'drop', function ( event ) {
			event.preventDefault();
			var reader = new FileReader();
			reader.addEventListener( 'load', function ( event ) {
				material.map.image.src = event.target.result;
				material.map.needsUpdate = true;
			}, false );
			reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
			document.body.style.opacity = 1;
		}, false );
	
		//
	
		window.addEventListener( 'resize', onWindowResize, false );
	
	}
	
	function onWindowResize() {
	
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	
		renderer.setSize( window.innerWidth, window.innerHeight );
	
	}
	
	function onDocumentMouseDown( event ) {
	
		event.preventDefault();
	
		isUserInteracting = true;
	
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
	
		onPointerDownLon = lon;
		onPointerDownLat = lat;
	
	}
	
	function onDocumentMouseMove( event ) {
	
		if ( isUserInteracting === true ) {
	
			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
	
		}
	
	}
	
	function onDocumentMouseUp( event ) {
	
		isUserInteracting = false;
	
	}
	
	function onDocumentMouseWheel( event ) {
	
		// WebKit
		if ( event.wheelDeltaY ) {
			camera.fov -= event.wheelDeltaY * 0.05;

		// Opera / Explorer 9
		} else if ( event.wheelDelta ) {
			camera.fov -= event.wheelDelta * 0.05;
	
		// Firefox
		} else if ( event.detail ) {
	
			camera.fov += event.detail * 1.0;
	
		}
		camera.updateProjectionMatrix();
	
	}
	
	function animate() {
	
		requestAnimationFrame( animate );
		update();
	
	}
	
	function update() {
	
		if ( isUserInteracting === false ) {
	
//			lon += 0.05;
	
		}
	
		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon );
	
		camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
		camera.target.y = 500 * Math.cos( phi );
		camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
	
		camera.lookAt( camera.target );
	
		renderer.render( scene, camera );
	
	}





	var video_file_index = 0;
	var files = [
		'textures/videos_s_3.mp4',
		'textures/videos_s_7.mp4'
	];
	video.addEventListener('ended', function(){
		video_file_index = video_file_index + 1;
		if (video_file_index >= files.length) {
			video_file_index = 0;
		}
	    video.src = files[video_file_index];
	    video.load();
	    video.play();
	});

}

