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

// -----------------------------------------------------------------------------
// 1) TIEMPO Y RENDIMIENTO
// -----------------------------------------------------------------------------
// Timer y Clock se usan en cada frame para actualizar controles y animaciones.
const timer = new THREE.Timer();
timer.connect( document );

// Panel de rendimiento (FPS, ms, memoria).
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

// -----------------------------------------------------------------------------
// 2) ESCENA, CAMARA Y RENDERER
// -----------------------------------------------------------------------------
// Escena principal donde se agregan todos los objetos 3D.
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xe3dadb );

// Camara en perspectiva.
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Posicion inicial para ver la escena desde un angulo elevado.
camera.position.set( 0, 2.5, 18 ); //x, y, z

// Renderer WebGL que dibuja la escena en el canvas.
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


// -----------------------------------------------------------------------------
// 3) CONTROLES DE CAMARA Y UI DE DESCRIPCION
// -----------------------------------------------------------------------------
// Descripcion mostrada en la interfaz para cada tipo de control.
const description = {
  Orbit: 'Permite rotar alrededor de un punto objetivo, hacer zoom y desplazarse. Es ideal para visualizar modelos 3D.',
  Fly: 'Permite volar a través de la escena con movimientos suaves. Es ideal para simulaciones de vuelo o exploración en primera persona.',
  FirstPerson: 'Simula el movimiento de un personaje en primera persona, permitiendo caminar y mirar alrededor. Es perfecto para juegos o experiencias inmersivas.',
  PointerLock: 'Similar a FirstPersonControls pero requiere que el usuario haga clic para bloquear el cursor, proporcionando una experiencia de control total. Es ideal para juegos en primera persona.',
  Trackball: 'Similar a OrbitControls pero con una sensación de control más fluida, como si estuvieras manipulando una bola de control. Es excelente para exploración libre.',
  Transform: 'Permite manipular objetos en la escena (mover, rotar, escalar) de manera interactiva. Es útil para editores de escenas o herramientas de diseño.'
};

// Instancia de todos los controles disponibles.
const controlMap = {
  Orbit: new OrbitControls( camera, renderer.domElement ),
  FirstPerson: new FirstPersonControls( camera, renderer.domElement ),
  Fly: new FlyControls( camera, renderer.domElement ),
  PointerLock: new PointerLockControls( camera, document.body ),
  Trackball: new TrackballControls( camera, renderer.domElement ),
  Transform: new TransformControls( camera, renderer.domElement )
};

// Control activo por defecto.
let activeControl = controlMap.Orbit;

// Configuracion base de velocidad y sensibilidad.
controlMap.Fly.movementSpeed = 5;
controlMap.Fly.rollSpeed = Math.PI / 24;
controlMap.FirstPerson.movementSpeed = 5;
controlMap.FirstPerson.lookSpeed = 0.1;

// Elementos HTML donde se muestra el nombre y la descripcion del control.
const titleElement = document.getElementById( 'control-title' );
const descriptionElement = document.getElementById( 'control-desc' );

// Cambia entre controles, habilita/deshabilita y gestiona lock/unlock cuando aplica.
function setControls( key ) {
  titleElement.textContent = `${key} Controls`;
  descriptionElement.textContent = description[key];

  Object.entries( controlMap ).forEach( ( [name, control] ) => {
    if ( 'enabled' in control ) {
      control.enabled = name === key;
    }
  } );

  if ( activeControl && activeControl !== controlMap[key] && typeof activeControl.unlock === 'function' ) {
    activeControl.unlock();
  }

  activeControl = controlMap[key] || controlMap.Orbit;

  if ( activeControl && typeof activeControl.lock === 'function' && key === 'PointerLock' ) {
    activeControl.lock();
  }
}

// -----------------------------------------------------------------------------
// 4) CARGA DEL MODELO 3D (GLTF + DRACO)
// -----------------------------------------------------------------------------
// Cargador principal para archivos .glb/.gltf.
const loader = new GLTFLoader();

// DRACO permite decodificar geometria comprimida en modelos GLTF.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '../src/models/glb/' );
loader.setDRACOLoader( dracoLoader );

// Carga asincrona del modelo del nivel y ajuste de posicion/rotacion.
const gltf = await loader.loadAsync( '../src/models/glb/scene.glb' );
gltf.scene.position.set( 0, -2.5, 3.5 );
gltf.scene.rotation.y = Math.PI * 1.5;
scene.add( gltf.scene );

// -----------------------------------------------------------------------------
// 5) GUI (LUCES Y CAMARA)
// -----------------------------------------------------------------------------
const gui = new GUI();

// Estado inicial que controla los elementos de la interfaz de luces.
const params = {
  lightType: 'Hemisphere',
  enabled: true,
  intensity: 1,
  color: '#ffffff',
  positionX: 0,
  toggleLight: function () {
    this.enabled = !this.enabled;
  }
};


// Light
let currentLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
scene.add( currentLight );

// Reemplaza la luz actual segun el tipo seleccionado en GUI.
function changeTypeLight( typeLight ) {
  scene.remove( currentLight );

  switch ( typeLight ) {
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
      break;
  }

  currentLight.position.set( 2, 1, 1 );
  scene.add( currentLight );
}

// Carpeta de luz en GUI.
const lightFolder = gui.addFolder( 'Light' );
lightFolder.open();

lightFolder
  .add( params, 'lightType', ['Hemisphere', 'Directional', 'Ambient'] )
  .name( 'Light Type' )
  .onChange( changeTypeLight );
lightFolder
  .add( params, 'enabled' )
  .name( 'Light Enabled' )
  .onChange( value => {
    currentLight.visible = value;
  } );
lightFolder
  .add( params, 'intensity', 0, 5 )
  .name( 'Light Intensity' )
  .onChange( value => {
    currentLight.intensity = value;
  } );
lightFolder
  .addColor( params, 'color' )
  .name( 'Light Color' )
  .onChange( value => {
    currentLight.color.set( value );
  } );
lightFolder
  .add( params, 'positionX', -10, 10 )
  .name( 'Position X' )
  .onChange( value => {
    currentLight.position.x = value;
  } );

// Carpeta de traslacion de camara.
const cameraFolderTranslation = gui.addFolder( 'Camera Translation' );
cameraFolderTranslation.add( camera.position, 'x', -20, 20 ).name( 'Position X' );
cameraFolderTranslation.add( camera.position, 'y', -20, 20 ).name( 'Position Y' );
cameraFolderTranslation.add( camera.position, 'z', -20, 20 ).name( 'Position Z' );
cameraFolderTranslation.open();

// Carpeta de rotacion de camara.
const cameraFolderRotation = gui.addFolder( 'Camera Rotation' );
cameraFolderRotation.add( camera.rotation, 'x', -Math.PI, Math.PI ).name( 'Rotation X' );
cameraFolderRotation.add( camera.rotation, 'y', -Math.PI, Math.PI ).name( 'Rotation Y' );
cameraFolderRotation.add( camera.rotation, 'z', -Math.PI, Math.PI ).name( 'Rotation Z' );
cameraFolderRotation.open();

// Selector de script/control activo para la camara.
const cameraFolderControls = gui.addFolder( 'Camera Controls' );
cameraFolderControls
  .add( { Script: 'Orbit' }, 'Script', ['Orbit', 'Trackball', 'Fly', 'FirstPerson', 'PointerLock'] )
  .onChange( setControls );
cameraFolderControls.open();

// Inicializa la UI con el control por defecto.
setControls( 'Orbit' );





// -----------------------------------------------------------------------------
// 6) LOOP DE ANIMACION Y EVENTOS
// -----------------------------------------------------------------------------
// Se ejecuta en cada frame: actualiza controles, helpers, stats y render.
function animate( time ) {
  const delta = timer.getDelta();
  timer.update();

  if ( activeControl && typeof activeControl.update === 'function' ) {
    activeControl.update( delta );
  }

  stats.update();
  renderer.render( scene, camera );
}

// Mantiene proporcion correcta cuando cambia el tamano de la ventana.
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
