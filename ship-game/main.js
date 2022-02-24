import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js'; 
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

let camera, scene, renderer;
let controls, water, sun;
let playerx ,playerz
const loaders = new GLTFLoader();

function random(min, max){
return Math.random()*(max-min)+min
}
class Boat {

  constructor(  ){
 
    
    loaders.load("assets/boat/thousand_sunny/scene.gltf", (gltf)=>{
  scene.add(gltf.scene)
  gltf.scene.scale.set(3, 3, 3)
      gltf.scene.position.set(5,2,50)
      gltf.scene.rotation.y = 1.5
    
  this.boat = gltf.scene
  this.speed = {
    velocity :0.0,
    rotation :0.0 
  }
})
}
update(){
  if(this.boat)
  {
    
    this.boat.rotation.y += this.speed.rotation
    this.boat.translateZ(this.speed.velocity)
    //camera.translateX(-this.speed.velocity)
    // camera.position.x = this.boat.position.x
    // camera.position.z = this.boat.position.z
    // camera.position.x = this.boat.position.x-50
    // camera.position.z = this.boat.position.z-50
    playerx = this.boat.position.x
    playerz = this.boat.position.z
    // console.log(camera.position)
  }
}

stop(){
  this.speed.velocity = 0
  this.speed.rotation =0
}
}

const boat = new Boat()

class Enemy{
  constructor(){
    loaders.load("assets/boat/marine_ship/scene.gltf",(gltf)=>{
    scene.add(gltf.scene)
    gltf.scene.scale.set(0.05, 0.05, 0.05)
    gltf.scene.position.set(0,-3,0)
    this.enemy = gltf.scene
  }
    )
}}

class Fruit{
  constructor(_scene){
   scene.add(_scene)
    _scene.scale.set(3, 3, 3)
    _scene.position.set(random(-200,200),3,random(-200,200))
    this.fruit = _scene
  }
    
}

async function loadModel(url)
{
  return new Promise((resolve,reject)=>{
    loaders.load(url,(gltf)=>{
      resolve(gltf.scene)
    })
  }) 
}

let boatModel =null
async function createTrash(){

  if(!boatModel)
  {boatModel = await loadModel("assets/treasure/mera_mera_no_mi/scene.gltf")}
  return new Fruit(boatModel.clone())
}

createTrash().then(trash =>{
  console.log("Trash")
})
//let marine = new Enemy();

let fruits = []
const fruitCount = 10

init();
animate();

async function init() {
 

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild( renderer.domElement );

  

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );

  //overhead view
  // camera.position.set( 0, 700, 0 );
  
  //
  camera.position.set( -91.18011761032999,  14.55, 28.0572  );
  sun = new THREE.Vector3();

  // Water

  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpeg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = - Math.PI / 2;

  scene.add( water );

  // Skybox

  const sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180
  };

  const pmremGenerator = new THREE.PMREMGenerator( renderer );

  function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    scene.environment = pmremGenerator.fromScene( sky ).texture;

  }

  updateSun();

 

  controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set( 0, 10, 0 );
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();
   
  const waterUniforms = water.material.uniforms;

  for(let i =0 ; i<fruitCount; i++)
  {
    const fruit  = await createTrash()
    fruits.push(fruit)
  }

  
  window.addEventListener( 'keydown', function(e){
    if(e.key == "w"){
      boat.speed.velocity = 1
    }
    if(e.key == "s"){
      boat.speed.velocity = -1
    }
    if(e.key == "d"){
      boat.speed.rotation = -0.1
    }
    if(e.key == "a"){
      boat.speed.rotation = 0.1
    }
  })
  window.addEventListener( 'keyup', function(e){
    boat.stop()
  })

}
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function isColliding(obj1, obj2)
{
  return (
    Math.abs(obj1.position.x - obj2.position.x) < 15 &&
    Math.abs(obj1.position.z - obj2.position.z) < 15
  )
}

function checkColissions(){
  if(boat.boat){
    fruits.forEach(fruit =>{
      if(fruit.fruit){
        
      }
    })
  }
}
function animate() {

  
  requestAnimationFrame( animate );
  render(); 
  boat.update()
  checkColissions()
}

function render() {

 

  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

  renderer.render( scene, camera );

}