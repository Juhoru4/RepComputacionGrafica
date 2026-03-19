import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//create a scene with threejs
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF9F7);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//light
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 5, 10, 7.5 );
scene.add( directionalLight );



//Cubes with diferent materials and trasparency
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const materialBasic = new THREE.MeshBasicMaterial( { color: 0x2932D9,
  transparent: true,
  opacity: 0.5
 } );


const materialStandart = new THREE.MeshStandardMaterial( { color: 0xff0000,
  roughness: 0.5,
  metalness: 0.5,
  transparent: false
 } );


const materialPhong = new THREE.MeshPhongMaterial( { color: 0xffffff,
  specular: 0xffffff,
  shininess: 30,
  side: THREE.DoubleSide,
  transparent: false,
  map: new THREE.TextureLoader().load('../../portafolio/class6/img/uv_test_bw_1024.png')
 } );


const materialLambert = new THREE.MeshLambertMaterial( { color: 0xffffff,
  transparent: false,
  map: new THREE.TextureLoader().load('../../portafolio/class6/img/face1.jpg')
 } );


 const materialLambertCube = [
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../../portafolio/class6/img/face1.jpg')}),
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../../portafolio/class6/img/face2.png')}),
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../../portafolio/class6/img/face3.jpg')}),
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../../portafolio/class6/img/face4.jpg')}),
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../../portafolio/class6/img/face5.png')}),
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../../portafolio/class6/img/face6.jpg')})
 ];

const materialNormal = new THREE.MeshNormalMaterial( { color: 0xff0000} );

const materialDepth = new THREE.MeshDepthMaterial( { color: 0xff0000} );

const materialLineBasic = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const materialLineDashed = new THREE.LineDashedMaterial( { color: 0x0000ff, dashSize: 0.1, gapSize: 0.5 } );

const materialPoints = new THREE.PointsMaterial( { color: 0x0000ff, size: 0.1 } );

const materialSprite = new THREE.SpriteMaterial( { color: 0x0000ff } );

const cube1 = new THREE.Mesh( geometry, materialBasic);
const cube2 = new THREE.Mesh( geometry, materialStandart );
const cube3 = new THREE.Mesh( geometry, materialPhong );
const cube4 = new THREE.Mesh( geometry, materialLambert );
const cube5 = new THREE.Mesh( geometry, materialLambertCube );
const cube6 = new THREE.Mesh( geometry, materialNormal);
const cube7 = new THREE.Mesh( geometry, materialDepth);
const cube8 = new THREE.Line( geometry, materialLineBasic );
const cube9 = new THREE.Line( geometry, materialLineDashed );
const cube10 = new THREE.Points( geometry, materialPoints );
const cube11 = new THREE.Sprite( materialSprite );
cube1.position.x = -6;
cube2.position.x = -4;
cube3.position.x = -2;
cube4.position.x = 0;
cube5.position.x = 2;
cube6.position.x = 4;
cube7.position.x = 6;
cube8.position.x = -6;
cube8.position.y = 2;
cube9.position.x = -4;
cube9.position.y = 2;
cube10.position.x = -2;
cube10.position.y = 2;
cube11.position.x = 0;
cube11.position.y = 2;
scene.add( cube1 );
scene.add( cube2 );
scene.add( cube3 );
scene.add( cube4 );
scene.add( cube5 );
scene.add( cube6 );
scene.add( cube7 );
scene.add( cube8 );
scene.add( cube9 );
scene.add( cube10 );
scene.add( cube11 );
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
