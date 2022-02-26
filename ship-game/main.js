import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js'; 
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

let camera, scene, renderer;
let controls, water, sun;
let playerx ,playerz
let starttime =1
let scrtime = Math.round(Date.now() / 1000);
const loaders = new GLTFLoader();
let curt  = Math.round(Date.now() / 1000); // 1405792937
let Pcurt  = Math.round(Date.now() / 1000); // 1405792937
let shot =0
let camang=1
let phealth =5
let enchk1 =0, cnchk2 =0, ench3 =0
let dam1 =15
let dam2 =30
let dam3 =60
let fruitscore= 0
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
  if(this.boat && phealth >0)
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
  else if(phealth==0)
  {
    this.boat.translateY(0.5)
    console.log("SEE YOU IN HEAVEN")
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
  constructor(n){
    loaders.load("assets/canon/canon/scene.gltf",(gltf)=>{
    scene.add(gltf.scene)
    
    if(n==1 && enemy.enemy)
    {gltf.scene.position.set(enemy.enemy.position.x,30,enemy.enemy.position.z )}
    else if(n==2 && enemy2.enemy2)
    {gltf.scene.position.set(enemy2.enemy.position.x,30,enemy2.enemy.position.z )}
    else if(n==3 && enemy3.enemy3)
    {gltf.scene.position.set(enemy3.enemy.position.x,30,enemy3.enemy.position.z )}
    gltf.scene.scale.set(0.3, 0.3, 0.3)
    //gltf.scene.rotation.y = 3
    this.canon = gltf.scene
    this.speed = {
      velocity :0.5,
      rotation :0.0 
    }

    this.rank = n 
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
    if(this.canon && boat.boat)
    {
    this.canon.lookAt(playerx,30,playerz)
    this.canon.translateZ(this.speed.velocity)
    if(this.rank ==1)
    {
    if( ((Date.now() / 1000)-curt )>=9.499999)
      {
        this.canon.position.x = enemy.enemy.position.x
        this.canon.position.z = enemy.enemy.position.z
      }
    }
    else if( this.rank==2)
    {
      if( ((Date.now() / 1000)-curt )>=9.499999)
      {
      this.canon.position.x = enemy2.enemy.position.x
      this.canon.position.z = enemy2.enemy.position.z
      }
    }
  }
  else if( this.rank==3)
  { if( ((Date.now() / 1000)-curt )>=9.499999)
    {
    this.canon.position.x = enemy3.enemy.position.x
    this.canon.position.z = enemy3.enemy.position.z
    } }
}
    }


class PlayerCanon{
constructor(){
  loaders.load("assets/canon/canon/scene.gltf",(gltf)=>{
  scene.add(gltf.scene)
   gltf.scene.position.set(boat.boat.position.x,30,boat.boat.position.z )
   
  gltf.scene.scale.set(0.3, 0.3, 0.3)
  //gltf.scene.rotation.y = 3
  this.canon = gltf.scene
  this.speed = {
    velocity :0.7,
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
    if(!shot)
    {
  this.canon.rotation.y = boat.boat.rotation.y
  this.canon.position.x = boat.boat.position.x
  this.canon.position.z = boat.boat.position.z
    }
    else if (shot==1)
{
   if(starttime)
   {
  Pcurt = Math.round(Date.now() / 1000);
  starttime =0
   }
  this.canon.translateZ(this.speed.velocity)
  console.log("GOOOO")
  if(Math.round(Date.now() / 1000)-Pcurt >=7)
  {
    this.canon.position.set(boat.boat.position.x,30,boat.boat.position.z )
    shot =0
    starttime= 1
  }
}
   
}

 
}
  }

  let pcanon = new PlayerCanon()
let canon = new Canon(1);
let canon2 = new Canon(2);
let canon3 = new Canon(3);
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
    if(e.key == " "){
      shot =1
      console.log("SPACE") 
    }
    if(e.key == "1"){
      camang =1
       
    }
    if(e.key == "2"){
      camang =2
       
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
          fruitscore++
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
          //console.log("HIT")
          phealth--
          canon.canon.position.x = enemy.enemy.position.x
          canon.canon.position.z = enemy.enemy.position.z
        }
         
        else if(Math.abs(canon.canon.position.x -playerx )<=10&& Math.abs(canon.canon.position.z - playerz)<=10){
          //console.log("EXPLODE")
          
          canon.canon.position.x = enemy.enemy.position.x
          canon.canon.position.z = enemy.enemy.position.z
        }
        
      }
    
  }
}

function checkCanonPColissions(){
  if(boat.boat){
   
      if(pcanon.canon && enemy.enemy && enemy2.enemy && enemy3.enemy){
        if(isColliding(pcanon.canon, enemy.enemy)    ){
          console.log("HIT ENEMY1")
          dam1--
        }
        if(isColliding(pcanon.canon, enemy2.enemy))
        {
          console.log("HIT ENEMY2")
          dam2--
        }
        if(isColliding(pcanon.canon, enemy3.enemy))
        {
          console.log("HIT ENEMY3")
          dam3--
        }
         
        
      }
    
  }
}


function cameraSetter(){
  if(boat.boat){
    if(camang==1)
    {
       camera.position.set(boat.boat.position.x-100, boat.boat.position.y+19, boat.boat.position.z+50 )
       camera.lookAt(boat.boat.position)
    }
    else if(camang ==2)
    {
      camera.position.set(boat.boat.position.x , 600, boat.boat.position.z  )
      camera.lookAt(boat.boat.position)
    }
    
  }
}

function checkCanon2Colissions(){
  if(boat.boat){
   
      if(canon2.canon){
        if(isColliding(boat.boat, canon2.canon)){
          //console.log("HIT")
          phealth--
          canon2.canon.position.x = enemy2.enemy.position.x
          canon2.canon.position.z = enemy2.enemy.position.z
        }
         
        else if(Math.abs(canon2.canon.position.x -playerx )<=10&& Math.abs(canon2.canon.position.z - playerz)<=10){
          //console.log("EXPLODE")
          
          canon2.canon.position.x = enemy2.enemy.position.x
          canon2.canon.position.z = enemy2.enemy.position.z
        }
        
      }
    
  }
}

function checkCanon3Colissions(){
  if(boat.boat){
   
      if(canon3.canon){
        if(isColliding(boat.boat, canon.canon)){
          //console.log("HIT")
          phealth--
          canon3.canon.position.x = enemy3.enemy.position.x
          canon3.canon.position.z = enemy3.enemy.position.z
        }
         
        else if(Math.abs(canon3.canon.position.x -playerx )<=10&& Math.abs(canon3.canon.position.z - playerz)<=10){
          //console.log("EXPLODE")
          
          canon3.canon.position.x = enemy3.enemy.position.x
          canon3.canon.position.z = enemy3.enemy.position.z
        }
        
      }
    
  }
}
function animate() {

  
  requestAnimationFrame( animate );
  render();
  pcanon.update() 
  canon.update()
  canon2.update()
  canon3.update()
  boat.update()
  if(dam1>0)
  {
  enemy.update()
  }
  else{
    enemy.enemy.translateY(-1)
  }
  if(dam2>0)
  {
  enemy2.update()
  }
  else{
    enemy2.enemy.translateY(-1)
  }
  if(dam3 >0)
  {
  enemy3.update()
  }
  else{
    enemy3.enemy.translateY(-1)
  }
  checkCanonPColissions()
  checkColissions() 
  checkCanonColissions()
  checkCanon2Colissions()
  checkCanon3Colissions()
  cameraSetter()
  document.getElementById("p1").innerHTML = phealth
  document.getElementById("p2").innerHTML = fruitscore+ 2*(15-dam1) + 2*(30-dam2) + 2*(60-dam3)
  document.getElementById("p3").innerHTML = Math.round(Date.now() / 1000) - scrtime;
  document.getElementById("p4").innerHTML = fruitscore

  if(dam1<=0 && dam2<=0 && dam3<=0)
  {
    document.getElementById("p5").innerHTML = "YOU WIN BRO"
  }
  else if(phealth<=0)
  {
    document.getElementById("p5").innerHTML = "UNFORTUNATE GAME BRO"
  }
}
 
function render() {

 

  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

  renderer.render( scene, camera );

}