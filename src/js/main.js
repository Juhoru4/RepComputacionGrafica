import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//create a scene with threejs
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF9F7);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//firts geometry shape
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x2932D9 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


//OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 5;
controls.update();

//GridHelper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );



//render
function animate( time ) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;
  controls.update();
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

//resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);
