import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//create a scene with threejs
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF9F7);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



//First geometry shapes
const geometryWalls = new THREE.BoxGeometry( 3, 2, 2 );
const materialWalls = new THREE.MeshBasicMaterial( { color: 0xffe7cc} );
const walls = new THREE.Mesh(geometryWalls, materialWalls );
scene.add( walls );

const geometryRoof = new THREE.ConeGeometry( 2.5, 1.25, 4 );
const materialRoof = new THREE.MeshBasicMaterial( { color: 0x1b191a } );
const roof = new THREE.Mesh(geometryRoof, materialRoof );
roof.position.y = 1.6;
roof.rotation.y = Math.PI / 4;
scene.add( roof );

const geometryDoor = new THREE.BoxGeometry(0.8, 1.6, 0.1);
const materialDoor = new THREE.MeshBasicMaterial({ color: 0x3d3938 });
const door = new THREE.Mesh(geometryDoor, materialDoor);
door.position.set(0, -0.2 , 1); 
scene.add(door);

const geometryWindowRight = new THREE.BoxGeometry(0.7, 0.7, 0.1);
const materialWindowRight = new THREE.MeshBasicMaterial({ color: 0x9db6d3 });
const MywindowRight = new THREE.Mesh(geometryWindowRight, materialWindowRight);
MywindowRight.position.set(1, 0.1 , 1); 
scene.add(MywindowRight);

const geometryWindowLeft = new THREE.BoxGeometry(0.7, 0.7, 0.1);
const materialWindowLeft = new THREE.MeshBasicMaterial({ color: 0x9db6d3 });
const MywindowLeft = new THREE.Mesh(geometryWindowLeft, materialWindowLeft);
MywindowLeft.position.set(-1, 0.1 , 1); 
scene.add(MywindowLeft);



//OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 5;
controls.update();

//GridHelper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

//AxesHelper
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


camera.position.z = 5;
camera.position.y = 2;


//render
function animate( time ) {
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
