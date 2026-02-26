import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//create a scene with threejs
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF9F7);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//First geometry shape CUBE
const geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
const materialCube = new THREE.MeshBasicMaterial( { color: 0x2932D9, wireframe: true } );
const cube = new THREE.Mesh( geometryCube, materialCube );
cube.position.x = -2;
scene.add( cube );

//second geometry shape TORUS
const geometryTorus = new THREE.TorusGeometry( 0.5, 0.2, 16, 15 );
const materialTorus = new THREE.MeshBasicMaterial( { color: 0xF5018E, wireframe: true } );
const torus = new THREE.Mesh( geometryTorus, materialTorus );
scene.add( torus );

//Third geometry shape CONE
const geometryCone = new THREE.ConeGeometry( 0.5, 1, 10 );
const materialCone = new THREE.MeshBasicMaterial( { color: 0x0D0705, wireframe: true } );
const cone = new THREE.Mesh(geometryCone, materialCone );
cone.position.x = 2;
scene.add( cone );



//OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 5;
controls.update();

//GridHelper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

camera.position.z = 5;
camera.position.y = 2;

//render
function animate( time ) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  torus.rotation.x = time / 2000;
  torus.rotation.y = time / 1000;

  cone.rotation.x = time / 2000;
  cone.rotation.y = time / 1000;

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
