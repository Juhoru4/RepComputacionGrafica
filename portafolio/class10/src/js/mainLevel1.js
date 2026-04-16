import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { GUI } from 'lil-gui';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

  



const timer = new THREE.Timer();
timer.connect( document );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe3dadb); //e3dadb

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


camera.position.z = 18;
camera.position.y = 2.5;
camera.position.x = 0;


const description = {
    Orbit: 'Permite rotar alrededor de un punto objetivo, hacer zoom y desplazarse. Es ideal para visualizar modelos 3D.',
    Fly: 'Permite volar a través de la escena con movimientos suaves. Es ideal para simulaciones de vuelo o exploración en primera persona.',
    FirstPerson: 'Simula el movimiento de un personaje en primera persona, permitiendo caminar y mirar alrededor. Es perfecto para juegos o experiencias inmersivas.',
    PointerLock: 'Similar a FirstPersonControls pero requiere que el usuario haga clic para bloquear el cursor, proporcionando una experiencia de control total. Es ideal para juegos en primera persona.',
    Trackball: 'Similar a OrbitControls pero con una sensación de control más fluida, como si estuvieras manipulando una bola de control. Es excelente para exploración libre.',
    Transform: 'Permite manipular objetos en la escena (mover, rotar, escalar) de manera interactiva. Es útil para editores de escenas o herramientas de diseño.'
};  

const controlMap = {
    Orbit: new OrbitControls( camera, renderer.domElement ),
    FirstPerson: new FirstPersonControls( camera, renderer.domElement ) ,
    Fly: new FlyControls( camera, renderer.domElement ) ,
    PointerLock: new PointerLockControls( camera, document.body ) ,
    Trackball: new TrackballControls( camera, renderer.domElement ) ,
    Transform: new TransformControls( camera, renderer.domElement )
};  

// Configuración inicial de los controles
controlMap.Fly.movementSpeed = 5;
controlMap.Fly.rollSpeed = Math.PI / 24;

controlMap.FirstPerson.movementSpeed = 5;
controlMap.FirstPerson.lookSpeed = 0.1;





const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

function animate( time ) {
  timer.update();
  stats.update();
  renderer.render( scene, camera );
}


//UI
const titleElement = document.getElementById('control-title');
const descriptionElement = document.getElementById('control-desc');

function setControls(key) {

  //alert(`Selected control: ${key}`);

    // Lógica para establecer los controles
    titleElement.textContent = `${key} Controls`;
    descriptionElement.textContent = description[key];
}





//--------Load scene from gltf file----------------------
const loader = new GLTFLoader();
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '../src/models/glb/' );
loader.setDRACOLoader( dracoLoader );
const gltf = await loader.loadAsync( '../src/models/glb/scene.glb' );
gltf.scene.position.set(0, -2.5, 3.5);
gltf.scene.rotation.y = Math.PI*1.5; // Rota 180 grados en el eje Y
scene.add( gltf.scene );



window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}




// ***************************************************************

//-------- GUI--------
const gui = new GUI();

// Parámteros iniciales para controlar la luz
const params = {
  lightType: 'hemisphere',
  enabled: true,
  intensity: 1,
  color: '#ffffff',
  positionX: 0,
  toggleLight: function() {
      this.enabled = !this.enabled;
  }
};


// Crear la carpeta de luz
const lightFolder = gui.addFolder('Light');
lightFolder.open();

// Añadir controles a la carpeta de luz
lightFolder.add(params, 'lightType', ['Hemisphere', 'Directional', 'Ambient']).name('Light Type').onChange(changeTypeLight);
lightFolder.add(params, 'enabled').name('Light Enabled') .onChange( value => currentLight.visible = value );
lightFolder.add(params, 'intensity', 0, 5).name('Light Intensity') .onChange( value => currentLight.intensity = value );
lightFolder.addColor(params, 'color').name('Light Color') .onChange(value => currentLight.color.set(value));
lightFolder.add(params, 'positionX', -10, 10).name('Position X').onChange(value => currentLight.position.x = value);

// Light
let currentLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
scene.add( currentLight );

function changeTypeLight(typeLight) {
    scene.remove(currentLight);
    switch (typeLight) {
        case 'Hemisphere':
            currentLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
        break;
        case 'Directional':
            currentLight = new THREE.DirectionalLight( 0xffffff, 2 );
        break;
        case 'Ambient':
            currentLight = new THREE.AmbientLight( 0xffffff, 2 );
        break;

        default:
            currentLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
        break
    }

    currentLight.position.set( 2, 1, 1 );
    scene.add( currentLight );
}


//Camera
const cameraFolderTranslation = gui.addFolder('Camera Translation');
  cameraFolderTranslation.add(camera.position, 'x', -20, 20).name('Position X');
  cameraFolderTranslation.add(camera.position, 'y', -20, 20).name('Position Y');
  cameraFolderTranslation.add(camera.position, 'z', -20, 20).name('Position Z');
  cameraFolderTranslation.open();

const cameraFolderRotation = gui.addFolder('Camera Rotation');
  cameraFolderRotation.add(camera.rotation, 'x', -Math.PI, Math.PI).name('Rotation X');
  cameraFolderRotation.add(camera.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y');
  cameraFolderRotation.add(camera.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z') ;
  cameraFolderRotation.open();

const cameraFolderControls = gui.addFolder('Camera Controls');
  cameraFolderControls.add({ Script: 'Orbit' }, 'Script', ['Orbit', 'Trackball', 'Fly', 'FirstPerson', 'PointerLock']).onChange(setControls);
  cameraFolderControls.open();
