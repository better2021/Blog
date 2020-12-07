var mouseX = 0,
	mouseY = 0,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	SEPARATION = 200,
	AMOUNTX = 10,
	AMOUNTY = 10,
	camera,
	scene,
	renderer

init()
animate()

function init() {
	var container,
		separation = 100,
		amountX = 50,
		amountY = 50,
		particle

	container = document.createElement("div")
	document.body.appendChild(container)
	scene = new THREE.Scene()
	renderer = new THREE.CanvasRenderer({ alpha: true }) // gradient; this can be swapped for WebGLRenderer
	renderer.setSize(window.innerWidth, window.innerHeight)
	container.appendChild(renderer.domElement)
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		10000
	)
	camera.position.z = 100

	// particles
	var PI2 = Math.PI * 2
	var material = new THREE.SpriteCanvasMaterial({
		color: 0xe58a25,
		program: function (context) {
			context.beginPath()
			context.arc(0, 0, 0.5, 0, PI2, true)
			context.fill()
		},
	})

	var geometry = new THREE.Geometry()
	for (var i = 0; i < 100; i++) {
		particle = new THREE.Sprite(material)
		particle.position.x = Math.random() * 2 - 1
		particle.position.y = Math.random() * 2 - 1
		particle.position.z = Math.random() * 2 - 1
		particle.position.normalize()
		particle.position.multiplyScalar(Math.random() * 10 + 350)
		particle.scale.x = particle.scale.y = 3
		scene.add(particle)
		geometry.vertices.push(particle.position)
	}

	// lines
	var line = new THREE.Line(
		geometry,
		new THREE.LineBasicMaterial({ color: 0x573e0e, opacity: 0.8 })
	)
	scene.add(line)

	// mousey
	// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// // 	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	// document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener("resize", onWindowResize, false)
} // end init();

function onWindowResize() {
	windowHalfX = window.innerWidth / 2
	windowHalfY = window.innerHeight / 2
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

var state = 1 // 4 个阶段
var clientX = windowHalfX
var clientY = 0
var stepX = 1.5
var stepY = (windowHalfY / windowHalfX) * stepX
function randMove() {
	// 计算 x 值
	if (state === 1) {
		// 向 rightCenter 移动
		clientX += stepX
		clientY += stepY
		if (clientX >= window.innerWidth) {
			state = 2
		}
	} else if (state === 2) {
		// 向 bottomCenter 移动
		clientX -= stepX
		clientY += stepY
		if (clientX <= windowHalfX) {
			state = 3
		}
	} else if (state === 3) {
		// 向 leftCenter 移动
		clientX -= stepX
		clientY -= stepY
		if (clientX <= 0) {
			state = 4
		}
	} else if (state === 4) {
		// 向 topCenter 移动
		clientX += stepX
		clientY -= stepY
		if (clientX >= windowHalfX) {
			state = 1
		}
	}
	mouseX = (clientX - windowHalfX) / 1.5
	mouseY = (clientY - windowHalfY) / 1.5
	requestAnimationFrame(randMove)
}
randMove()

// function onDocumentMouseMove(event) {
//     mouseX =( event.clientX - windowHalfX)/1.5;
//     mouseY = (event.clientY - windowHalfY)/1.5;
// }

// function onDocumentTouchStart( event ) {
// 	if ( event.touches.length > 1 ) {
//     event.preventDefault();
//     mouseX = event.touches[ 0 ].pageX - windowHalfX;
//     mouseY = event.touches[ 0 ].pageY - windowHalfY;
//   }
// }

// function onDocumentTouchMove( event ) {
//   if ( event.touches.length == 1 ) {
//       event.preventDefault();
//       mouseX = event.touches[ 0 ].pageX - windowHalfX;
//       mouseY = event.touches[ 0 ].pageY - windowHalfY;
// 	}
// }

function animate() {
	requestAnimationFrame(animate)
	render()
}

function render() {
	camera.position.x += (mouseX - camera.position.x) * 0.5
	camera.position.y += (-mouseY + 200 - camera.position.y) * 0.5
	camera.lookAt(scene.position)
	renderer.render(scene, camera)
}
