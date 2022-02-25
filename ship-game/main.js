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
let curt  = Math.round(Date.now() / 1000); // 1405792937

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
    playerx = 5
    playerz = 50
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
    if((Math.round(Date.now() / 1000)- curt) >=10)
    {
      playerx = this.boat.position.x
      playerz = this.boat.position.z
      curt = Math.round(Date.now() / 1000)
    }
    //camera.translateX(-this.speed.velocity)
    // camera.position.x = this.boat.position.x
    // camera.position.z = this.boat.position.z
    // camera.position.x = this.boat.position.x-50
    // camera.position.z = this.boat.position.z-50
    // playerx = this.boat.position.x
    // playerz = this.boat.position.z
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
    gltf.scene.position.set(random(-500,500),3,random(-500,500))
    this.enemy = gltf.scene
    this.speed = {
      velocity :0.05,
      rotation :0.0 
    }
  }
    )
}
update()
{
  if(boat.boat&& this.enemy)
  {
    
    this.enemy.rotation.y += this.speed.rotation
    this.enemy.translateZ(this.speed.velocity)
    this.enemy.lookAt(boat.boat.position.x,boat.boat.position.y,boat.boat.position.z)
    //camera.translateX(-this.speed.velocity)
    // camera.position.x = this.boat.position.x
    // camera.position.z = this.boat.position.z
    // camera.position.x = this.boat.position.x-50
    // camera.position.z = this.boat.position.z-50
    // playerx = this.boat.position.x
    // playerz = this.boat.position.z
    // console.log(camera.position)
  }
}
}


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
async function createFruit(){

  if(!boatModel)
  {boatModel = await loadModel("assets/treasure/mera_mera_no_mi/scene.gltf")}
  return new Fruit(boatModel.clone())
}

 
let enemy = new Enemy();
let enemy2 = new Enemy();
let enemy3 = new Enemy();

class Canon{
  constructor(){
    loaders.load("assets/canon/canon/scene.gltf",(gltf)=>{
    scene.add(gltf.scene)
    
    gltf.scene.position.set(enemy.enemy.position.x,30,enemy.enemy.position.z )
    gltf.scene.scale.set(0.3, 0.3, 0.3)
    //gltf.scene.rotation.y = 3
    this.canon = gltf.scene
    this.speed = {
      velocity :0.5,
      rotation :0.0 
    }

    // this.target=
    // {
    //   x :boat.boat.position.x, 
    //   y : boat.boat.position.y
    // }
  }
    )
}

  update()
  {
    if(this.canon)
    {
    this.canon.lookAt(playerx,30,playerz)
    this.canon.translateZ(this.speed.velocity)
    if( ((Date.now() / 1000)-curt )>=9.499999)
      {
        this.canon.position.x = enemy.enemy.position.x
        this.canon.position.z = enemy.enemy.position.z
      }
    }
  }
}

let canon = new Canon();
let fruits = []
let enemies = []
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
    const fruit  = await createFruit()
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
        if(isColliding(boat.boat, fruit.fruit)){
          console.log("TREASURE")
          scene.remove(fruit.fruit)
          fruit.fruit.position.x=1000;
        }
      }
    })
  }
}

function checkCanonColissions(){
  if(boat.boat){
   
      if(canon.canon){
        if(isColliding(boat.boat, canon.canon)){
          console.log("HIT")
          
          canon.canon.position.x = enemy.enemy.position.x
          canon.canon.position.z = enemy.enemy.position.z
        }
         
        else if(Math.abs(canon.canon.position.x -playerx )<=10&& Math.abs(canon.canon.position.z - playerz)<=10){
          console.log("EXPLODE")
          
          canon.canon.position.x = enemy.enemy.position.x
          canon.canon.position.z = enemy.enemy.position.z
        }
        
      }
    
  }
}
function animate() {

  
  requestAnimationFrame( animate );
  render(); 
  canon.update()
  boat.update()
  enemy.update()
  enemy2.update()
  enemy3.update()
  
  checkColissions()
 
  checkCanonColissions()
  
 
}


function drawString(ctx, text, posX, posY, textColor, rotation, font, fontSize) {
  var lines = text.split("\n");
  if (!rotation) rotation = 0;
  if (!font) font = "'serif'";
  if (!fontSize) fontSize = 16;
  if (!textColor) textColor = '#000000';
   ctx.save();
   ctx.font = fontSize + "px " + font;
   ctx.fillStyle = textColor;
   ctx.translate(posX, posY);
   ctx.rotate(rotation * Math.PI / 180);
  for (i = 0; i < lines.length; i++) {
     ctx.fillText(lines[i],0, i*fontSize);
  }
   ctx.restore();
}
 
 function run() {
  var nbc = document.getElementById("nb").getContext('2d');
  drawString(nbc, 'SCORE:01278765454', 60, 60, '#EE4',0,"Verdana",36);
  drawString(nbc, '__________________________________Allianos Illegados__', 63, 20, '#F63',0,"verdana",12);
  drawString(nbc, 'best lap: 20.2 s -  time: 20.2 sec ',85,85,'#a66',0,"Trebuchet MS",22);
  drawString(nbc, 'DOWN ->',10,10,'#66a',90,"Trebuchet MS",24);
  drawString(nbc, 'UP ->',500,72,'#66a',-90,"Trebuchet MS",24);
 }
function render() {

 

  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

  renderer.render( scene, camera );

}