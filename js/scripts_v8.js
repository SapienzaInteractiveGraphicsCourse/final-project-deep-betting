import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import  * as dat from "dat.gui"
import gsap from 'gsap'
import * as CANNON from 'cannon-es';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'


import {dumpObject} from './utility.js'
import {Robot} from './robot.js'

//----NUOVE COSTANTI----
var robotArray = [];



//--------------START FISICA-----------------
const timeStep = 1 / 60;
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -100, 0)
});


//fisica scuderia
const scuderiaPhysMat = new CANNON.Material();
const scuderiaBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(-45,0.1,0),
    material: scuderiaPhysMat
});
world.addBody(scuderiaBody);
//--------------END FISICA-----------------
 
//---------------- COSTANTI ----------------
let currentPrice = 100;
const settings = {
    spawnAmount: 3,
}
var animationName = ['Robot_Dance','Robot_Death','Robot_Idle','Robot_Jump','Robot_No','Robot_Punch','Robot_Running','Robot_Sitting','Robot_Standing','Robot_ThumbsUp','Robot_Walking','Robot_WalkJump','Robot_Wave','Robot_Yes'];
//----------------  END COSTANTI ---------------

//-------------- ASSETS -----------
const robotAsset = new URL( '../assets/Robot.glb', import.meta.url)
const scuderia = new URL('../assets/Houses_SecondAge_1_Level1.gltf', import.meta.url)
const muro1 = new URL('../assets/Wall_FirstAge.gltf', import.meta.url)
const ostacolo1 = new URL('../assets/Crate.gltf', import.meta.url)
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

//Texture del mondo
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
scene.background = cubeTextureLoader.load([
    skySceneBG,
    skySceneBG,
    skySceneBG,
    landSceneBG,
    skySceneBG,
    skySceneBG
]);


let robotMesh = null;
let mixers = [];
let currentAnimationAction = [] ;
let robotBodyList = [];
let robotGltfList = [null];
let robotList = [];
let ostacoliList = [];
let ostacoliBodyList = [];
let spawnedObstaclesList = [];
let spawnedObstaclesBodyList = [];
var spawnedObstaclesBLID = [];
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

var collisionsStorage = {};

//weights for animation blending
var myRobotRunningWeight = 1
var myRobotPunchWeight = 0
var myRobotJumpWeight = 0

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
var winnerTimer = 0
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
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(), //infinite plane
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

//END PLANE



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


//COMPETITION
function managePreCompetition(){
    let startingCountDownOpacity = 1;
    let countDownElement = document.querySelector('#countdown-current-value')
    countDownElement.style.opacity = 1;
    countDownElement.innerHTML = "3";

    //move the camera behind the robot
    if(!cameraBehindRobotFinished){
        //set the fov of the camera to 75
        camera.fov = 55;
        camera.updateProjectionMatrix();
        
        cameraBehindRobotFinished = true;
        tl.to(camera.position,{
            x: robotArray[myRobotIndex].mesh.position.x - 30,
            y: robotArray[myRobotIndex].mesh.position.y + 15,
            z: robotArray[myRobotIndex].mesh.position.z,
            duration: 2,
            onUpdate: function(){
                camera.lookAt(robotArray[myRobotIndex].mesh.position.x,robotArray[myRobotIndex].mesh.position.y,robotArray[myRobotIndex].mesh.position.z)
            },
            onComplete: function() {
                console.log('Camera behind the robot ---> complete');
                tl.clear();
            }
        })
    }
    //todo this coundown is repeating even if has been completed
    if(!countDownFinished){
        tl.to(countDownElement,{
            duration: 3,
            onUpdate: function(){
                countDownCompetitionManagement(tl.time());
            },
            onComplete: function() {
                console.log('Countdown ---> complete');
                countDownFinished = true;
            }
        })        
    }else{
        for(let i = 0; i< robotList.length; i++){
            mixers[i].stopAllAction();
        }
    }
}

function hideCountdown(){
    let countDownElement = document.querySelector('.countdown-competition');
    if(countDownElement){
        countDownElement.classList.add('hide-animation');
    }

    //wait 1 second and remove the element
    setTimeout(function(){
        countDownElement.remove();
    }
    ,3000);
    
}

function manageRunning(){
    //mangaer for the robot 2
    myRobotCompetitionManager();

    //manager for all the other robots
    for(let i = 0; i< robotArray.length; i++){
        if(i != myRobotIndex){
            robotCompetitionManager(i)
        }
    }

    manageTimer()
    checkForWinner();
}

function manageTimer(){
    timerDelta = ((new Date() - competitionTimerStart)/1000).toFixed(2);
    document.querySelector('#competition-timer-value').innerHTML = "Timer : " +timerDelta + "s";
}

function attachListenerPositionsToRobots(){
    for(let i = 0; i < robotList.length; i++){
        robotList[i].position.addEventListener('change',function(e){
            console.log(e);
        })
    }
}


function robotCompetitionManager(robotIndex){
    if(robotIndex != myRobotIndex){
        //check that the robot is not near an obstacle
        let result = checkIfNearObstacle(robotIndex)
        if(result.near == true){
            robotArray[robotIndex].speed = 0
            // console.log("Stop robot " + i + " because is near an obstacle")
            //if is near an obstacle define a random action to do for the current robot
            //if the robot is near an obstacle, it will do a random action
            let randomAction = Math.floor(Math.random() * 3);
            robotArray[robotIndex].punchAnimation();
            //console.log("Robot " + i + " is near an obstacle, will do action " + randomAction)
            switch(randomAction){
                case 0:
                    options.robotAnimationsActive.i = "running";
                    break;
                case 1:
                    options.robotAnimationsActive.i = "punch";
                    break;
                case 2:
                    options.robotAnimationsActive.i = "jump";
                    break;
            }
        }

        controlAnimation(robotIndex)
        //based on the action defined, the robot will do a different animation
        //adjust the speed of the robot based on the action
        robotArray[robotIndex].mesh.position.setX(robotArray[robotIndex].mesh.position.x + robotArray[robotIndex].speed)
        }
}


function myRobotCompetitionManager(){ //function manager of the behaviour of my robot
    controlAnimation(myRobotIndex);
    robotArray[myRobotIndex].mesh.position.setX(robotArray[myRobotIndex].mesh.position.x + robotArray[myRobotIndex].speed )
    //TODO remove thiscommet on camera
    // camera.position.setX(robotArray[myRobotIndex].mesh.position.x - 30)

    //check if need to print an highlight mesh on the ground
    //checkForHighlightMesh_Obstacle(robotArray[myRobotIndex].mesh.position.x)
    checkKeyPressed(myRobotIndex)
}


function checkForHighlightMesh_Obstacle(robotX){
    //given the spawned obstacle and the current position of the robot, check if the robot is near an obstacle
    //if the robot is near an obstacle, highlight the ground before the obstacle
    //if the robot passes the obstacle, remove the highlight mesh
    console.log("robotX: " + robotX)
    for(let i = 0; i< spawnedObstaclesList.length; i++){
        if(spawnedObstaclesList[i].position.x - robotX < 30){
            for(let j = 0; j < 3; j++){
                let highlightMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(3, 3),
                    new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
                );
                highlightMesh.rotateX(-Math.PI / 2);
                // add a key to the highlightMeshTracker that is the 'obstacle_i'
                // if the key is not present, add it and add the mesh to the scene
                // if the key is present, check if the mesh is already in the scene
                // if the mesh is not in the scene, add it
                // if the mesh is in the scene, do nothing
                if(!highlightMeshTracker.hasOwnProperty("obstacle_" + i)){
                    highlightMeshTracker["obstacle_" + i] = []
                    highlightMeshTracker["obstacle_" + i].push(highlightMesh)
                }else{
                    if(!highlightMeshTracker["obstacle_" + i].includes(highlightMesh)){
                        highlightMeshTracker["obstacle_" + i].push(highlightMesh)
                    }
                }



                highlightMesh.position.set(spawnedObstaclesList[i].position.x - (j*3) ,0.1,spawnedObstaclesList[i].position.z)
                scene.add(highlightMesh);
            }
        }else{

        }
    }
}  


var stillJumping = false
var currentAnimationActive = 'running'
function checkKeyPressed(robotIndex){
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32){ //PUNCH
            currentAnimationActive = 'punch'

            //(TODO FIXA QUA\)
            if(robotIndex == myRobotIndex){
                //speed reduced because of the punch
                myRobotSpeed = 0.1
            }

               
            checkIfNeedToDestroyObstacle(robotIndex)
        }
        //if button is shift (jump)
        if(event.keyCode == 16){ //JUMP     
            currentAnimationActive = 'jump'

            if (!stillJumping) {
                myRobotSpeed = 0.5
                stillJumping = true;
                var robotTl = gsap.timeline();
              
                // Animate the robot's position
                robotTl.to(robotArray[myRobotIndex].mesh.position, {
                  duration: 0.5,
                  y: robotArray[myRobotIndex].mesh.position.y + 10,
                  ease: "power2.inOut"
                });
              
                // Animate the camera position
                tl.clear();
                tl.to(camera.position, {
                  duration: 0.5,
                  y: camera.position.y + 2,
                  ease: "power2.inOut",
                  onComplete: function() {
                    tl.to(camera.position, {
                      duration: 0.2,
                      y: camera.position.y - 2,
                      ease: "power2.inOut",
                    });
              
                    // After the camera animation completes, animate the robot back to its original position
                    robotTl.to(robotArray[myRobotIndex].mesh.position, {
                      duration: 0.7,
                      y: robotArray[myRobotIndex].mesh.position.y - 10,
                      ease: "power2.inOut",
                      onComplete: function() {
                        stillJumping = false;
                        myRobotSpeed = 0.3
                      }
                    });
                  }
                });
            }
        }
    }) 
}



function controlAnimation(robotIndex){
    const runnningClip = THREE.AnimationClip.findByName(Robot.clips, 'Robot_Running');
    const runningAction = robotArray[robotIndex].mixer.clipAction(runnningClip);
    const punchClip = THREE.AnimationClip.findByName(Robot.clips, 'Robot_Punch');
    const punchAction = robotArray[robotIndex].mixer.clipAction(punchClip);
    const jumpClip = THREE.AnimationClip.findByName(Robot.clips, 'Robot_Jump');
    const jumpAction = robotArray[robotIndex].mixer.clipAction(jumpClip);

    if(robotIndex == myRobotIndex){
        if(currentAnimationActive != 'running'){
            runningAction.setLoop(THREE.LoopOnce);
            robotArray[robotIndex].mixer.addEventListener('finished', (event) => robotAnimationChain(event,runningAction,punchAction,jumpAction,robotIndex));
        }else{    
            runningAction.play();
        }
    }
    else{
        performAnimation(robotIndex)
    }   
}
        
function performAnimation(robotIndex){

}

function robotAnimationChain(e,runningAction,punchAction,jumpAction,robotIndex){
    if(robotIndex == myRobotIndex){
        if(e.action._clip.name == 'Robot_Running'){
            switch(currentAnimationActive){
                case 'punch':
                    punchAction.reset();
                    punchAction.loop = THREE.LoopOnce;
                    punchAction.timeScale = 0.7;
                    punchAction.play();
                    break;
                case 'jump':
                    jumpAction.reset();
                    jumpAction.loop = THREE.LoopOnce;
                    jumpAction.play();
                    break;
            }
        }
        if(e.action._clip.name == 'Robot_Punch'){
            runningAction.reset();
            runningAction.loop = THREE.LoopRepeat;
            runningAction.play();
            currentAnimationActive = 'running'
            if(robotIndex == myRobotIndex){
                myRobotSpeed = 0.3
            }
        }
        if(e.action._clip.name == 'Robot_Jump'){
            runningAction.reset();
            runningAction.loop = THREE.LoopRepeat;
            runningAction.play();
            currentAnimationActive = 'running'
        }
    }
}


function setRobotInitialSpeed(){
    for(let i = 0; i < robotArray.length; i++){
        if(i == myRobotIndex){
            robotArray[i].speed = myRobotSpeed
        }else{
            //random speed between 0.1 and 0.3
            robotArray[i].speed  = Math.random() * (0.3 - 0.1) + 0.1;
        }
    }
}


function checkIfNeedToDestroyObstacle(robotIndex){
    //chech all the spawned obstacles and see if the robot is near one of them
    //if the robot is near an obstacle, destroy it
    for(let i = 0; i< spawnedObstaclesList.length; i++){
        if(spawnedObstaclesList[i].position.x - robotArray[robotIndex].mesh.position.x < 10){
            //destroy the obstacle
            //wait 400 ms before destroying the obstacle
            setTimeout(function(){
                const force = new CANNON.Vec3(0, 10, -3);
                const point = new CANNON.Vec3(spawnedObstaclesBodyList[i].position.x, spawnedObstaclesBodyList[i].position.y, spawnedObstaclesBodyList[i].position.z); // the point to apply the force on (in local coordinates)
                spawnedObstaclesBodyList[i].applyForce(force, point);
            }, 400)

            // scene.remove(spawnedObstaclesList[i])
            // world.removeBody(spawnedObstaclesBodyList[i])
            // spawnedObstaclesList.splice(i,1)
            // spawnedObstaclesBodyList.splice(i,1)
            // console.log("destroyed obstacle")
        }
    }
}

function checkIfNearObstacle(robotIndex){
    let obstacleInLine = getObstaclesInLine(robotIndex)
    
    
    let result = {}
    for (let i = 0; i < obstacleInLine.length; i++) {
        if (obstacleInLine[i].position.x - robotArray[robotIndex].mesh.position.x  < 10) {
            result.near = true;
            result.obstacle = obstacleInLine[i];
        }
    }
    if (result.near) {
        return result;
    }else{
        result.near = false;
        return result;
    }
}

function obstacleCollisonHandler(e){
    // let otherBody = e.contact.bi;
    // let thisBody = e.contact.bj;
    // console.log("Collisione di un ostacolo")
    // console.log(thisBody)

    //todo: find a way to identify the obstacle that is colliding with the robot and reduce the speed of the robot
}
  
var reducingSpeed = false
function robotCollisonHandler(e){
    //check if spawnedObstaclesBLID contains the id of the e.target
    // console.log(e.body.id)
    if(spawnedObstaclesBLID.includes(e.body.id)){
        //reduce the speed of the robot
        // console.log("Collisione di un robot"+e.body.id+" con un ostacolo spawnato "+e.target.id)

        //todo diminuire la velocita del robot corretto e non sempre del myrobotindex
        if(reducingSpeed == false && myRobotSpeed > 0.1){
            // console.log("diminuisco la velocita -->",myRobotSpeed)
            myRobotSpeed -= 0.03
        }else{
            // console.log("Smetto di diminuire la velocita -->",myRobotSpeed)
            reducingSpeed = true
        }
        
    }

}



function countDownCompetitionManagement(time){
    var countDown = document.querySelector('#countdown-current-value')
    document.querySelector('#start-game').style.display = 'none';
    if(countDown){
        if(time>1){
            countDown.innerHTML = "3";
            
            if(!countDownSound.isPlaying && !playedSoundsCountdown[0]  && options.settings.sound_enabled == true){
                countDownSound.play();
                playedSoundsCountdown[0] = true;
            }
        }
        if(time>2){
            countDown.innerHTML = "2";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[1] && options.settings.sound_enabled == true){
                countDownSound.play();
                playedSoundsCountdown[1] = true;
            }
        }
        if(time>3){
            countDown.innerHTML = "1";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[2] && options.settings.sound_enabled == true){
                countDownSound.play();
                playedSoundsCountdown[2] = true;
            }
        }
        if(time>4){
            countDown.innerHTML = "VIA";
            if(!startSound.isPlaying && !playedSoundsCountdown[3] && options.settings.sound_enabled == true){
                startSound.play();
                playedSoundsCountdown[3] = true;
            }
        }
    }
}

function checkForWinner(){
    if(!winnerScreen){
        for (let i = 0; i < robotList.length; i++) {
            if(robotList[i].position.x >= 100){
                // console.log("Robot " + i + " is the winner");
                winnerScreen = true
                winnerRobot = i;
                winnerTimer = timerDelta;
                // TODO DECOMMENT
                // printWinnerScreen();
                // state = "winner";
            }
        }
    }
}

function printWinnerScreen(){
    document.querySelector('.winner-screen').classList.remove('d-none');

    //add to the .message.competition-timer the class d-none
    document.querySelector('.message.competition-timer').classList.add('d-none');

    if(winnerRobot == myRobotIndex){
        document.querySelector('.lost-container').classList.add('d-none');
        document.querySelector('#winner-screen-message').innerHTML = "YOU WON!";
        document.querySelector('#winner-time').classList.add('d-none');
        document.querySelector('#your-time').innerHTML = "Your time: <b>"+timerDelta+"s</b>";
    }else{
        document.querySelector('.trofeo-container').classList.add('d-none');
        document.querySelector('#winner-screen-message').innerHTML = "YOU LOST!";
        document.querySelector('#winner-time').innerHTML = "Winner time: <b>"+timerDelta+"s</b>";
        document.querySelector('#your-time').classList.add('d-none');
    }
}
//END COMPETITIOn


function animate() {
    world.step(timeStep);

    //State management
    switch(state){
        case 0:
            //attach a listener for collide to the robotArray
            for(let i = 0; i < robotArray.length; i++){
                robotArray[i].physicsBody.addEventListener("collide", robotCollisonHandler);
            }
            break
        case 'spawning':
            document.querySelector('.message-spawning').classList.remove('d-none');
            spawnOstacoli(tl,settings.spawnAmount);
            if(spawned == true && cameraSpawningFinished == true){
                document.querySelector('.message-spawning').classList.add('d-none');
                state='competition';
                //add the collide event Listener to all the spawned obstacles
                for(let i = 0; i < spawnedObstaclesBodyList.length; i++){
                    spawnedObstaclesBodyList[i].addEventListener("collide", obstacleCollisonHandler); 
                }

                console.log('Move to competition state')
            }
            break;
        case 'competition':
            if(countDownFinished) {
                hideCountdown();
                document.querySelector('.competition-timer').style.display = "block";
                competitionTimerStart = Date.now();
                state='running';
            }else{
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
    linkMeshesAndBody(ostacoliList,ostacoliBodyList)
    linkMeshesAndBody(spawnedObstaclesList,spawnedObstaclesBodyList)
    
    const delta = clock.getDelta();
    if(Robot.loaded){
        for(let i = 0; i < robotArray.length ; i++){
            robotArray[i].physicsBody.position.copy(robotArray[i].mesh.position);
            robotArray[i].physicsBody.quaternion.copy(robotArray[i].mesh.quaternion);
            robotArray[i].mixer.update(delta);
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
    // camera.position.set(100, 30, 0);
    // camera.lookAt(-100,0,0)
    if (Robot.loaded) {
        createRobots()
        setRobotInitialSpeed();
        camera.position.set(robotArray[0].mesh.position.x+30, robotArray[0].mesh.position.y + 14, robotArray[0].mesh.position.z);
        camera.lookAt(robotArray[0].mesh.position.x,robotArray[0].mesh.position.y,robotArray[0].mesh.position.z)
        orbit.target.set(robotArray[0].mesh.position.x,robotArray[0].mesh.position.y,robotArray[0].mesh.position.z);
    }
    //manageRobots(assetLoader,5,{width:100,heigth:100})
   
    createScuderie(assetLoader,5,{width:100,heigth:100})
    createPaglia(assetLoader,5)
    createWalls(assetLoader,38,6,{width:100,heigth:100})

    if(Robot.loaded) state = 'waitingForSpawn'
}

function createRobots(){
    //Create the robots
    for(let i = 0; i < options.gameConstants.num_robots; i++){
        robotArray.push(new Robot(scene,world, -125, 0.1,((-30)+(i*15))));
        if(i == 0){
            robotArray[i].showBonesGuide();
            robotArray[i].showButtonsForActions();
        }
    }
}

function createWalls(assetLoader,num_walls,num_lines,world_size){
    //Caricamento Muri
    let wallModel ;
    assetLoader.load(muro1.href,function(gltf){
        wallModel = gltf.scene.children[0]; // get the root object of the model
        wallModel.position.set(-130, 0, -37,5); // set the initial position of the model
        wallModel.scale.set(5,5,5)
        scene.add(wallModel); // add the model to the scene


        // Create copies of the model and add them to the scene
        const wallSpacing = 15;
        
        if(wallModel){
            for (let i = 0; i < num_lines; i++) {
                for (let j = 0 ; j< num_walls; j++){
                    const wall = wallModel.clone();
                    wall.position.set(wall.position.x + (j * 7) , 0, wall.position.z + (i * wallSpacing));
                    scene.add(wall);
                }
            }
            console.log('Walls added to the scene')
        }
    });
}

function createScuderie(assetLoader,num_lines,world_size){
    //Caricamento Scuderie
    let scuderiaMesh = null;
    assetLoader.load(scuderia.href, function(gltf){
        scuderiaMesh = gltf.scene.children[0];
        scene.add(scuderiaMesh);
        scuderiaMesh.traverse(function(node){
            if(node.isMesh) node.castShadow = true;
        })
        scuderiaMesh.scale.set(8,8,8);
        scuderiaMesh.position.set(-130,0.1,-30); 
        scuderiaMesh.rotation.set(0,Math.PI/2,0);
        
        const wallSpacing = 15;
        if(scuderiaMesh){
            for (let i = 0; i < num_lines; i++) {
                const scuderia = scuderiaMesh.clone();
                scuderia.position.set(scuderia.position.x,scuderia.position.y,scuderia.position.z + (i * 15))
                scene.add(scuderia)
            }
        }


    },undefined,function(error){
        console.log(error)
    })
}

function createPaglia(assetLoader, num_lines) {
    let pagliaMesh = null;
    assetLoader.load(
      paglia.href,
      function (gltf) {
        pagliaMesh = gltf.scene.children[0];
        scene.add(pagliaMesh);
        pagliaMesh.traverse(function (node) {
          if (node.isMesh) node.castShadow = true;
        });
        pagliaMesh.scale.set(3, 3, 3);
        pagliaMesh.rotation.set(0, Math.PI / 2, 0);
  
        if (pagliaMesh) {
          // create and add paglia meshes
          addPagliaMeshes(pagliaMesh, -120, 0.2, -35, 2, 51);
          addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, -19.7, 2, 51, { x: 2.7 });
          addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, -4.7, 2, 51, { x: 2.7 });
          addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, 10.5, 2, 51, { x: 2.7 });
          addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, 25.5, 2, 51, { x: 2.7 });
        }
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );
}
  
function addPagliaMeshes(pagliaMesh, startX, startY, startZ, numLayers, numColumns, options = {} ) {
    const { x = 3, y = 3, z = 3 } = options;
    pagliaMesh.scale.set(x, y, z);
    pagliaMesh.position.set(startX, startY, startZ);
    for (let i = 0; i < numLayers; i++) {
        for (let j = 0; j < numColumns; j++) {
        const paglia = pagliaMesh.clone();
        paglia.position.set(
            paglia.position.x + j * 5,
            paglia.position.y,
            paglia.position.z + i * 10
        );
        scene.add(paglia);
    }
}
}

function tracciaLinee(num_lines){
    const highlightMeshLine = new THREE.Mesh(
        new THREE.PlaneGeometry(3,3),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: false
        })
    );

    highlightMeshLine.rotateX(-Math.PI / 2);
    highlightMeshLine.position.set(0, 0.01, 0);
    scene.add(highlightMeshLine);

}

function manageRobots(assetLoader, num_lines,world_size){
    //Caricamento Robot
    
    assetLoader.load(robotAsset.href, function(gltf){
        const model = gltf.scene;
        robotMesh = gltf.scene.children[0];
        robotGltf = gltf;

        robotMesh.traverse(function(node){
            if(node.isMesh) node.castShadow = true;
        })

        robotMesh.scale.set(1.2,1.2,1.2);
        robotMesh.position.set(-125,0,-30);
        scene.add(robotMesh);
        robotMesh.rotation.set(0,Math.PI/2,0);
        robotList.push(robotMesh)
        
        

    
        //fisica robot
        //const robotPhysMat = new CANNON.Material();
        const robotPhysMat = new CANNON.ContactMaterial(new CANNON.Material(), new CANNON.Material(), { friction: 100.0, restitution: 0.0 });

        if(robotMesh){
            const boundingBox = new THREE.Box3().setFromObject(model);

            // Calculate the size of the box
            const size = new CANNON.Vec3();
            size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
            size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
            size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);

            // Create the body using the size
            const shape = new CANNON.Box(size);
            let cannonBodyRobot = new CANNON.Body({ 
                mass: 15, 
                shape: new CANNON.Box(shape.halfExtents), 
                position: new CANNON.Vec3(-38,0.1,-32),
                // material: robotPhysMat ,
                type: CANNON.Body.KINEMATIC,
            });
            if(myRobotIndex == 0){
                myRobotID = cannonBodyRobot.id;
            }
            robotArray.push(cannonBodyRobot);
        
            // world.addBody(robotArray[0]);
            world.addBody(cannonBodyRobot);
        }

        //model.getObjectByName("Cylinder022").material.color.setHex(0x00FF00)
        let randomClipInit = ['Robot_Dance','Robot_Idle','Robot_ThumbsUp','Robot_Wave'];
        let randomClipElement = randomClipInit[Math.floor(Math.random() * randomClipInit.length)];

        const clips = gltf.animations;
        const mixer = new THREE.AnimationMixer(robotMesh);
        const initialClip = THREE.AnimationClip.findByName(clips,randomClipElement);
        currentAnimationAction[0] = mixer.clipAction(initialClip);
        currentAnimationAction[0].play();
        mixers.push(mixer);
        
        for (let i= 1; i < num_lines; i++ ){
            if(robotMesh){
                const robot = SkeletonUtils.clone(robotMesh);
                robot.traverse(function(node){
                    if(node.isMesh) node.castShadow = true;
                })
                robot.scale.set(1.2,1.2,1.2);
                robot.position.set(robotList[0].position.x ,robotList[0].position.y,robotList[0].position.z+(i *15));
                robotList.push(robot)
                scene.add(robot)

                const boundingBox = new THREE.Box3().setFromObject(robotMesh);
    
                // Calculate the size of the box
                const size = new CANNON.Vec3();
                size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
                size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
                size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);
    
                // Create the body using the size
                const shape = new CANNON.Box(size);
                let robotBodyCANNON = new CANNON.Body({ 
                    mass: 15, 
                    shape: new CANNON.Box(shape.halfExtents), 
                    position: new CANNON.Vec3(robotList[0].position.x,robotList[0].position.y,robotList[0].position.z +(i *15)),
                    material: robotPhysMat ,
                    type: CANNON.Body.KINEMATIC,
                })                
                if(myRobotIndex == i){
                    myRobotID = robotBodyCANNON.id;
                }
                robotArray.push(robotBodyCANNON);
                world.addBody(robotArray[i]);
                
                let currentRandomClipElement = randomClipInit[Math.floor(Math.random() * randomClipInit.length)];

                mixers[i] = new THREE.AnimationMixer(robotList[i]);
                const currentInitialClip = THREE.AnimationClip.findByName(clips,currentRandomClipElement);
                currentAnimationAction[i] = mixers[i].clipAction(currentInitialClip);
                currentAnimationAction[i].play();
            } 
        }
        
        

    },undefined,function(error){
        console.log(error)
    })
}


//FOR CREATIVE MODE MANAGING
var highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3,3),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: false
    })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.material.color.setHex(0x0000FF);
scene.add(highlightMesh);
function mouseMoveAddOstacoli(e){
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObject(planeMesh);
    if(intersects.length > 0) {
        const intersect = intersects[0];
        // console.log(intersect)
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor();
        
        highlightMesh.position.set(highlightPos.x, 0.1, highlightPos.z);

        const objectExist = ostacoliList.find(function(object) {
            return (object.position.x + 3 >= highlightMesh.position.x ) && (object.position.x - 3 < highlightMesh.position.x)
            && (object.position.z + 3 >= highlightMesh.position.z) && (object.position.z - 3 < highlightMesh.position.z)
        });

        
        const possibleToRelease =  check_possible_release_ostacolo(highlightMesh.position.x,highlightMesh.position.z );

        if(!objectExist && possibleToRelease)
            highlightMesh.material.color.setHex(0xFFFFFF);
        else
            highlightMesh.material.color.setHex(0xFF0000);
    }
}

function insertOstacoli(assetLoader){
    //AGGIUNGI OSTACOLI ALLA PISTA 
    let releaseMode = document.querySelector('#release-obstacle').getAttribute("enabled");
    console.log("Release mode: ",releaseMode)

    if(releaseMode == "false"){
        scene.remove(highlightMesh)
    }else{
        scene.add(highlightMesh)

        window.addEventListener('mousemove', mouseMoveAddOstacoli );
        
        let ostacolo1Mesh;
        let ostacoloGltf;
        assetLoader.load(ostacolo1.href, function(gltf){
            ostacolo1Mesh = gltf.scene.children[0];
            ostacoloGltf = gltf;
            ostacolo1Mesh.traverse(function(node){
                if(node.isMesh) node.castShadow = true;
            })
        },undefined,function(error){
            console.log(error)
        })

        window.addEventListener('mousedown', function() {
            var cash_val = document.querySelector("#cash-value");

            const objectExist = ostacoliList.find(function(object) {
                return (object.position.x + 3 >= highlightMesh.position.x ) && (object.position.x - 3 < highlightMesh.position.x)
                && (object.position.z + 3 >= highlightMesh.position.z) && (object.position.z - 3 < highlightMesh.position.z)
            });

            if(!objectExist) {
                if(currentPrice >= 10){
                    if(intersects.length > 0) {
                        const possibleToRelease =  check_possible_release_ostacolo(highlightMesh.position.x,highlightMesh.position.z );
                        if(possibleToRelease){
                            const ostacolo1Clone = ostacolo1Mesh.clone();
                            ostacolo1Clone.scale.set(40,40,40);
                            ostacolo1Clone.position.copy(highlightMesh.position);
                            scene.add(ostacolo1Clone);
                            
                            highlightMesh.material.color.setHex(0xFF0000);
        
                            const ostacoliPhysMat = new CANNON.ContactMaterial(new CANNON.Material(), new CANNON.Material(), { friction: 0.0, restitution: 0.0 });
                            const boundingBox = new THREE.Box3().setFromObject(ostacoloGltf.scene);
                    
                            // Calculate the size of the box
                            const size = new CANNON.Vec3();
                            size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
                            size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
                            size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);
            
                            // Create the body using the size
                            const shape = new CANNON.Box(size);

                            let ostacoloBody = new CANNON.Body({ 
                                mass: 50, 
                                shape: new CANNON.Box(shape.halfExtents), 
                                position: new CANNON.Vec3(highlightMesh.position.x,highlightMesh.position.y,highlightMesh.position.z),
                                 material: ostacoliPhysMat,
                            } );   

                            console.log("ostacoloBody at position: ",ostacoloBody.position)
                            console.log("ostacoloMesh at position: ",ostacolo1Clone.position)
                            
                            //tolgo i soldi
                            currentPrice -= 10;
                            cash_val.innerHTML = currentPrice;

                            //aggiungo ostacolo al mondo
                            ostacoliBodyList.push(ostacoloBody);
                            ostacoliList.push(ostacolo1Clone)
                            console.log("ostacoliBodyList length: ",ostacoliBodyList.length)
                            console.log("ostacoliList length: ",ostacoliList.length)
                            world.addBody(ostacoloBody);
                        }
                    }
                }else{
                    //select #budget-finished and remove class d-none
                    document.querySelector("#budget-finished").classList.remove("d-none");
                }
                
            }else{
                //rimuovi ostacolo piazzato     
                let ostacoliList_obj_index =  ostacoliList.findIndex((element) => element.uuid === objectExist.uuid)
                if(ostacoliList_obj_index != -1){
                    scene.remove(objectExist);  
                    ostacoliList = ostacoliList.slice(0,ostacoliList_obj_index).concat(ostacoliList.slice(ostacoliList_obj_index+1));
                    ostacoliBodyList = ostacoliBodyList.slice(0, ostacoliList_obj_index ).concat(ostacoliBodyList.slice(ostacoliList_obj_index+1));
                    world.removeBody(objectExist)

                    highlightMesh.material.color.setHex(0xFFFFFF);
                    currentPrice += 10;
                    document.querySelector("#budget-finished").classList.add("d-none");
                    cash_val.innerHTML = currentPrice;
                }
            }
        });
    }
    //END AGGIUNGI OSTACOLI
}

function check_possible_release_ostacolo(x,z){
    if(z != 30 && z != 15 && z != -15 && z != -30 ){ 
        return false;
    }
    if(x < -100 || x > 100){
        return false;
    }
    return true;
}

function getLinesRange(){
    return {
        line0: {
            z_start: 23,
            z_end: -37
        },
        line1: {
            z_start: -9,
            z_end: -22
        },
        line2: {
            z_start: 7,
            z_end: -8
        },
        line3: {
            z_start: 22,
            z_end: 8
        },
        line4: {
            z_start: 37,
            z_end: 23
        }
    }
}

function getObstaclesInLine(lineNumber) {
    const linesRange = getLinesRange();
    const line = `line${lineNumber}`;
    const zStart = linesRange[line].z_start;
    const zEnd = linesRange[line].z_end;
    
    return ostacoliBodyList.filter((obstacle) => {
      return obstacle.position.z >= zEnd && obstacle.position.z <= zStart;
    });
}
//END CREATIVE MODE

//Spawn ostacoli

function spawnOstacoli(tl, spawnAmount) {
    if(!spawned){
        spawned = true;
        console.log("Spawning ostacoli ....")
        tl.clear();
        
        //define the obstacles loader
        let ostacolo1Mesh;
            assetLoader.load(ostacolo1.href, function(gltf){
                ostacolo1Mesh = gltf.scene.children[0];
                ostacolo1Mesh.traverse(function(node){
                    if(node.isMesh) node.castShadow = true;
                })

            

            const obstacleDistance = 10;
            const obstacleRange = 100;
        
            // calculate the total width needed for all obstacles
            const totalObstacleWidth = spawnAmount * obstacleDistance;
        
            // calculate the start and end points for obstacle spawning
            const startPoint = -obstacleRange + totalObstacleWidth / 2;
            const endPoint = obstacleRange - totalObstacleWidth / 2;


            var center = { x: 0, y: 0, z: 0 };
            // Definisci il raggio del cerchio
            var radius = 300;
            // Definisci la durata dell'animazione
            var duration = 2;
            
            tl.to(camera.position, {
                x: center.x + radius,
                y: 200,
                z: center.z,
                duration: duration / 4,
                ease: "circ.out",
                onUpdate: function(){
                    camera.fov = 180;
                    camera.lookAt(0,0,0)
                },
            })
            .to(camera.position, {
                x: center.x,
                y: 200,
                z: center.z - radius,
                duration: duration / 4,
                ease: "circ.out",
                onUpdate: function(){
                    camera.fov = 180;
                    camera.lookAt(0,0,0)
                },
            })
            .to(camera.position, {
                x: center.x - radius,
                y: 200,
                z: center.z,
                duration: duration / 4,
                ease: "circ.out",
                onUpdate: function(){
                    camera.fov = 180;
                    camera.lookAt(0,0,0)
                },
            })
            .to(camera.position, {
                x: center.x,
                y: 200,
                z: center.z + radius,
                duration: duration / 4,
                ease: "circ.out",
                onUpdate: function(){
                    camera.fov = 180;
                    camera.lookAt(0,0,0)
                },
                onComplete: function(){
                    cameraSpawningFinished = true;
                    console.log("Camera spawning finished")
                }
            });

            
            // spawn obstacles at random positions between the start and end points
            const ostacoliPhysMat = new CANNON.Material({ friction: 1000.0, restitution: 1.0 });
            for (let i = 0; i < spawnAmount; i++) {
                const position = Math.random() * (endPoint - startPoint - obstacleDistance) + startPoint + obstacleDistance / 2;
                
                // clone the obstacle
                const obstacleClone = ostacolo1Mesh.clone();
                //define a cannon body for the obstacle
                const obstacleBoundingBox = new THREE.Box3().setFromObject(gltf.scene);
                const obstacleBBSize = new CANNON.Vec3();
                obstacleBBSize.x = Math.abs(obstacleBoundingBox.max.x - obstacleBoundingBox.min.x);
                obstacleBBSize.y = Math.abs(obstacleBoundingBox.max.y - obstacleBoundingBox.min.y);
                obstacleBBSize.z = Math.abs(obstacleBoundingBox.max.z - obstacleBoundingBox.min.z); 
                
                let shape = new CANNON.Box(obstacleBBSize);
                var obstacleBody = new CANNON.Body({
                    shape: new CANNON.Box(shape.halfExtents),
                    mass: 50,
                    linearDamping: -0.5,
                    // material: ostacoliPhysMat 
                    }
                );

                // set the position of the clone
                obstacleClone.scale.set(40,40,40);
                obstacleClone.position.set(position, 40, 0);
                obstacleBody.position.copy(obstacleClone.position);
                spawnedObstaclesList.push(obstacleClone)
                spawnedObstaclesBodyList.push(obstacleBody)
                spawnedObstaclesBLID.push(obstacleBody.id)
                console.log("Spawned obstacle "+i+" with ID "+obstacleBody.id+" at position "+position)
                scene.add(obstacleClone);
                world.addBody(obstacleBody);
            }
            
        },function(progress){
            // console.log(progress)
            // TODO IMPLEMENTARE LOADER
        },
        function(error){
            console.log(error)
        })
        
       
    }
}



//PHYSICS FUNCTIONS
function linkMeshesAndBody(meshes,bodies){
    if(meshes.length != bodies.length){
        console.log("Error linking meshes and bodies")
        console.log("Meshes: "+meshes.length)
        console.log("Bodies: "+bodies.length)
        return
    }else{
        if(meshes.length >0){
            for(let i = 0; i < meshes.length; i++){
                if(bodies[i]){
                    meshes[i].position.copy(bodies[i].position)
                    meshes[i].quaternion.copy(bodies[i].quaternion)
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
    var cash_val = document.querySelector("#cash-value");
    cash_val.innerHTML =  currentPrice;

    const swiper = new Swiper('.swiper-container', {
        
        direction: 'horizontal',
        loop: true,
      
        
        pagination: {
          el: '.swiper-pagination',
        },
      
        
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
}
//----------------- END ONLOAD EVENTS ------------

//----------------- EVENT LISTENERS --------------
document.querySelector('#start-game').addEventListener('click',function(){

    if(currentPrice > 0){// TODO CHANGE HERE
        // //spawn obstacle in my line
        state = "spawning";
        camera.fov = 20;
        camera.updateProjectionMatrix();
        document.querySelector('#start-game').style.display = 'none';
        document.querySelector('.initial-screen').style.display = 'none';

        
    }else{
        alert("You must spend all of your budget before starting the game! \nYou still have "+currentPrice+"$\n.Enter in release mode and place the obstacles in the scene.\nFor more info check how it works!")
    }
    

})


//Release Mode Controller
document.querySelector('#release-obstacle').addEventListener('click',function(){
    // releaseMode = !releaseMode;
    releaseMode= true;
    if(releaseMode){
        console.log("enter release mode hide initial screen")
        document.querySelector('body').classList.add('pencil-cursor');
        document.querySelector('.release-mode-container').classList.remove('d-none');
        document.querySelector('#release-obstacle').setAttribute("enabled","true");   
        document.querySelector('.initial-screen').classList.add('d-none');
    }
    else{
        document.querySelector('.initial-screen').classList.remove('d-none');
        document.querySelector('body').classList.remove('pencil-cursor');
        document.querySelector('#release-obstacle').setAttribute("enabled","false");
    }

    document.querySelector('.current-cash-container').classList.toggle('d-none')
    insertOstacoli(assetLoader)
})

document.querySelector('#release-mode-exit').addEventListener('click',function(){
    console.log("exit release mode")
    document.querySelector("#budget-finished").classList.add("d-none");
    releaseMode = false;
    if(!releaseMode){
        document.querySelector('.initial-screen').classList.remove('d-none');
        document.querySelector('body').classList.remove('pencil-cursor');

        document.querySelector('.release-mode-container').classList.add('d-none');
        document.querySelector('#release-obstacle').setAttribute("enabled","false");
    }

    document.querySelector('.current-cash-container').classList.toggle('d-none')
})
//END release Mode

// START How it works
document.querySelector('#how-it-works').addEventListener('click',function(){
    document.querySelector('.initial-screen').classList.add('d-none');
    document.querySelector('.how-it-works-container').classList.remove('d-none');
})

document.querySelector('#how-it-works-exit').addEventListener('click',function(){
    document.querySelector('.initial-screen').classList.remove('d-none');
    document.querySelector('.how-it-works-container').classList.add('d-none');
})
// END How it works

document.querySelector("#play-again").addEventListener("click", function(){
    location.reload();
})
//----------------- END EVENT LISTENERS ----------