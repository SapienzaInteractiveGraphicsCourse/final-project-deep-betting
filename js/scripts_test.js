import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import  * as dat from "dat.gui"
import gsap from 'gsap'
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger'



import {dumpObject} from './utility.js'
import {Robot} from './robot.js'
import {Obstacle} from './obstacle.js'

//----NUOVE COSTANTI----
var robotArray = [];



//--------------START FISICA-----------------
const timeStep = 1 / 60;
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -100, 0)
});




//--------------END FISICA-----------------
 
//---------------- COSTANTI ----------------
let currentPrice = 100;
const settings = {
    spawnAmount: 3,
}

//----------------  END COSTANTI ---------------

//-------------- ASSETS -----------
const muro1 = new URL('../assets/Wall_FirstAge.gltf', import.meta.url)
const paglia = new URL('../assets/Farm_FirstAge_Level3_Wheat.gltf', import.meta.url)

import skySceneBG from "../assets/sky_bg.png"
import landSceneBG from "../assets/land_bg.png"
import groundTexture from "../assets/groundtexture.png"

const scene = new THREE.Scene();
const loadingManager = new THREE.LoadingManager();
const assetLoader = new GLTFLoader(loadingManager);

const progressBar = document.querySelector('#progress-bar');

loadingManager.onProgress = function(url,loaded,total){
    progressBar.value = (loaded/total)*100;
} 



const progressBarContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = function (){
    progressBarContainer.style.display = 'none';  
}

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
scene.background = cubeTextureLoader.load([
    skySceneBG,
    skySceneBG,
    skySceneBG,
    landSceneBG,
    skySceneBG,
    skySceneBG
]);


let robotList = [];
let wallList = [];
let wallBodyList = [];


var obstacleArray = [];
//-------------- END ASSETS -----------

// ----------- GLOBAL VARIABLES ----------
const tl = gsap.timeline(); //timeline for animations
let state = 0;
var releaseMode = false;
var time = 0; //time to manage the countdown

//competition variables
var cameraBehindRobotFinished = false;
var countDownFinished = false;
var myRobotIndex = 2;
var myRobotID = null;
var myRobotSpeed = 0.3

var competitionTimerStart = 0;
var timerDelta = 0;

// highlight mesh while robot is apporaching to an obstacle
var highlightMeshTracker = {}

//Sounds variables
var countDownSoundURL = require('url:../assets/sounds/countdown.mp3');
var startSoundURL = require('url:../assets/sounds/start.mp3');
var countDownSound = new Audio(countDownSoundURL);
var startSound = new Audio(startSoundURL);
var playedSoundsCountdown = [false,false,false,false];


//for animate function
const clock =  new THREE.Clock();

//creative mode variables
var intersects;

//spawing variables
var spawned = false; //to communicate that the spawning is finished
var cameraSpawningFinished = false; //to communicate that the spawning camera animation is finished

//winnings variables
var winnerScreen = false;
var winnerRobot = null
//---------- END GLOBAL VARIABLES ----------

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0x000000);
renderer.shadowMap.enabled = true;


const camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

orbit.update();

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(groundTexture);

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 100),
    new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: texture,
        bumpMap: texture,
        bumpScale: 5, // adjust the strength of the bump map
        // color: 0x4da42D,
        visible: true
    })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.receiveShadow = true;

const groundPhysMat = new CANNON.Material({
    friction: 100,
});
//get the bounding box of the planemesh
const planeBB = new THREE.Box3().setFromObject(planeMesh);
const planeSize = new THREE.Vector3(); 
planeBB.getSize(planeSize)
console.log(planeSize)
planeSize.y = 0.1;
const groundBody = new CANNON.Body({
    // shape: new CANNON.Box(planeSize), //infinite plane
    shape: new CANNON.Plane(), //infinite plane
    type: CANNON.Body.KINEMATIC,
    material: groundPhysMat
});
world.addBody(groundBody);


groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

//END PLANE

//--- Cannon debugger
const cannonDebugger = new CannonDebugger(scene, world,{});

//----------START Lights---------
const ambientLight = new THREE.AmbientLight(0xFEFEFE,0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFEFCDB, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-20, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = +100;
//--------------END LIGHTS--------------


//set some Options
var options = {
    directionalLight: {
        x: 0,
        y: 50,
        z: 0,
        rot_x: 0,
        rot_y: 0,
        rot_z: 0,
    },
    camera:{
        rot_x: camera.rotation.x,
        rot_y: camera.rotation.y,
        rot_z: camera.rotation.z,
    },
    gameConstants:{
        num_robots: 5,
        indexCameraFollows: myRobotIndex,
    },
    settings: {
        sound_enabled: false,
    },
    robotAnimationsActive:{
        0: 'running',
        1: 'running',
        2: 'running',
        3: 'running',
        4: 'running',
    }
}

var PressedKeys ={
    space: false,
    shift: false,
}




function animate() {
    world.step(timeStep);
    TWEEN.update();
    cannonDebugger.update();
    //State management
    switch(state){
        case 'spawning':
            document.querySelector('.message-spawning').classList.remove('d-none');
            spawnOstacoli(tl,settings.spawnAmount);
            if(spawned == true && cameraSpawningFinished == true){
                document.querySelector('.message-spawning').classList.add('d-none');
                state='competition';
                console.log('Move to competition state')
            }
            break;
        case 'competition':
            if(countDownFinished) {
                hideCountdown();
                document.querySelector('.competition-timer').style.display = "block";
                competitionTimerStart = Date.now();
                //enable the running clip for all the robots
                for(let i = 0; i < robotArray.length; i++){
                    robotArray[i].runningClip();
                }
                state='running';
            }    
            else{
                managePreCompetition()
            }
            break
        case 'running':
            manageRunning();
            break;
        case 'winner':
            break;
    }
    
    linkMeshesAndBody(planeMesh,groundBody)
    linkMeshesAndBody(wallList,wallBodyList)
    if(Obstacle.loaded) {
        linkMeshesAndBody(obstacleArray)
    }

    const delta = clock.getDelta();
    if(Robot.loaded){
        for(let i = 0; i < robotArray.length ; i++){
            robotArray[i].linkMeshAndBody();
            robotArray[i].updateMixer(delta);
        }
    }
    renderer.render(scene, camera);
}



// start the rendering loop
requestAnimationFrame(animate);
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});






//-----------------------FUNCTIONS-----------------
function createWorld(assetLoader){
    //This function takes care to add all the assets in the world as well as attach to them a cannonjs body    
    if (Robot.loaded) {
        createRobots()
        camera.position.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x+30, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y + 14, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
        camera.lookAt(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x,robotArray[options.gameConstants.indexCameraFollows].mesh.position.y,robotArray[options.gameConstants.indexCameraFollows].mesh.position.z)
        orbit.target.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x,robotArray[options.gameConstants.indexCameraFollows].mesh.position.y,robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
    }

    if(Robot.loaded){   
        for(let i = 0; i < robotArray.length; i++){
            if(i == myRobotIndex){
                console.log("adding collision handler to my robot")
                robotArray[i].physicsBody.addEventListener("collide", function(){
                    console.log("My robot collided")
                });
            }
            else{
                console.log("adding collision handler to robot "+i)
                robotArray[i].physicsBody.addEventListener("collide", function(e){
                    console.log("Robot "+i+" collided with "+e.body.id)
                    robotArray[i].punchAnimation(e.body,obstacleArray,scene,world)
                    robotArray[i].speed = robotArray[i].backup_speed; 
                    console.log("Set speed to "+robotArray[i].speed)
                });
            }
        }
        state = 'waitingForSpawn'
    } 

}

function createRobots(){
    //Create the robots
    for(let i = 0; i < options.gameConstants.num_robots; i++){
        robotArray.push(new Robot(scene,world, -125, 0.1,((-30)+(i*15))));
        if(i == myRobotIndex) robotArray[i].is_my_robot = true;
        if(i == myRobotIndex) robotArray[i].showBonesGuide()
    }
}




//END CREATIVE MODE

//PHYSICS FUNCTIONS
function linkMeshesAndBody(meshes,bodies){
    //check meshes is of class Obstacle
    if(bodies != undefined){
        if(meshes.length != bodies.length && bodies != undefined){
            console.log("Error linking meshes and bodies")
            console.log("Meshes: "+meshes.length)
            console.log("Bodies: "+bodies.length)
            return
        }
    }
    else{
        if(meshes.length >0){
            for(let i = 0; i < meshes.length; i++){
                if(meshes[i] instanceof Obstacle){
                    meshes[i].mesh.position.copy(meshes[i].physicsBody.position)
                    meshes[i].mesh.quaternion.copy(meshes[i].physicsBody.quaternion)
                }else{
                    if(bodies[i]){
                        meshes[i].position.copy(bodies[i].position)
                        meshes[i].quaternion.copy(bodies[i].quaternion)
                    }
                }
            }
        }
    }
}
//END PHYSICS FUNCTIONS



//------------------END FUNCTIONS-----------------



//---------------- ONLOAD EVENTS ----------------
window.onload = function (){
    createWorld(assetLoader);
}
//----------------- END ONLOAD EVENTS ------------

//----------------- EVENT LISTENERS --------------



//Release Mode Controller


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    if (state == 'running'){
        var keyCode = event.which;
        if (keyCode == 16) {
            if(!PressedKeys.shift && state == 'running') robotArray[myRobotIndex].jumpAnimation();
            PressedKeys.shift = true;
        } else if (keyCode == 32) {
            //get the obstacle from obstacleArray with the is_spawned flag set to true
            //and call the punch animation on that obstacle
            let spawnedObstacle = obstacleArray.filter(obstacle => obstacle.is_spawned == true);
            if(!PressedKeys.space && state == 'running') robotArray[myRobotIndex].punchAnimation(null,spawnedObstacle,scene,world);
            PressedKeys.space = true;
        } 
    }
};
document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    if (state == 'running'){
        var keyCode = event.which;
        if (keyCode == 16) {
            PressedKeys.shift = false;
        } else if (keyCode == 32) {
            PressedKeys.space = false;
        }
    }
};

const punchButton = document.createElement("button");        
punchButton.innerHTML = "Punch";
punchButton.classList.add("actionButton");
document.body.appendChild(punchButton);
//add an event listener to the button
punchButton.addEventListener("click", () => {
    robotArray[myRobotIndex].punchAnimation(null,obstacleArray,scene,world);
});


//create 5 buttons to spawn an obstacle on each robot line
for(let i = 0; i < options.gameConstants.num_robots; i++){
    const spawnButton = document.createElement("button");
    spawnButton.innerHTML = "Spawn Obstacle";
    spawnButton.classList.add("actionButton");
    spawnButton.style.top = ((i+1)*50)+"px";
    document.body.appendChild(spawnButton);
    //add an event listener to the button
    spawnButton.addEventListener("click", () => {
        let obstacle = new Obstacle(scene,world,robotArray[i].physicsBody.position.x+2,30,robotArray[i].physicsBody.position.z);
        obstacleArray.push(obstacle);
    });
}


//create a button for jump with position absolute top 0px right 50px onclick activate jump animation
const jumpButton = document.createElement("button");
jumpButton.innerHTML = "Jump";
jumpButton.classList.add("actionButton");
jumpButton.style.top = "0px";
jumpButton.style.right = "100px";
document.body.appendChild(jumpButton);
//add an event listener to the button
jumpButton.addEventListener("click", () => {
    robotArray[myRobotIndex].jumpAnimation();
});



//----------------- END EVENT LISTENERS ----------