import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import  * as dat from "dat.gui"
import gsap from 'gsap'
import * as CANNON from 'cannon-es';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'


//--------------START FISICA-----------------
const timeStep = 1 / 60;
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -100, 0)
});

const groundPhysMat = new CANNON.Material({
    friction: 100,
});
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(), //infinite plane
    //mass: 10
    // shape: new CANNON.Box(new CANNON.Vec3(100, 100, 0.1)),
    type: CANNON.Body.STATIC,
    name: 'ground',
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);


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
let characterLine = 0;
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

var competitionTimerDelta = 0;

var collisionsStorage = {};

//weights for animation blending
var myRobotRunningWeight = 1
var myRobotPunchWeight = 0
var myRobotJumpWeight = 0
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

//INITIALIZATION
createWorld(assetLoader)


//PLANE 
// const planeGeometry = new THREE.PlaneGeometry(160, 1000);
// const planeMaterial = new THREE.MeshStandardMaterial({
//     color: 0x4da42D,
//     side: THREE.DoubleSide
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);
// plane.rotation.x = -0.5 * Math.PI;
// plane.receiveShadow = true;


const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 100),
    new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: 0x4da42D,
        visible: true
    })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.receiveShadow = true;
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


//--------- START HELPER ----------------
//Axes Helper
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

//Lighter Helper
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
// scene.add(dLightHelper);

//Shadow Lighter Helper
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

// const gridHelper = new THREE.GridHelper(100, 100);
// scene.add(gridHelper);


// const grid = new THREE.GridHelper(100, 100);
// scene.add(grid);
//--------- END HELPER ----------------

//set the GUI
options = {
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
    myRobotAnimationWeights:{
        running: myRobotRunningWeight,
        punch: myRobotPunchWeight,
        jump: myRobotJumpWeight
    }
}

// const gui = new dat.GUI();
// gui.add(options.myRobotAnimationWeights, 'running', 0, 1 ).onChange((e) => {
//     options.myRobotAnimationWeights.running = e;
// });

// gui.add(options.myRobotAnimationWeights, 'punch', 0, 1 ).onChange((e) => {
//     options.myRobotAnimationWeights.punch = e;
// });

// gui.add(options.myRobotAnimationWeights, 'jump', 0, 1 ).onChange((e) => {
//     options.myRobotAnimationWeights.jump = e;
// });

// gui.add(options.directionalLight, 'x', -50, 50).onChange(() => {
//     directionalLight.position.setX(options.directionalLight.x);
// });
  
// gui.add(options.directionalLight, 'y', 0, 50).onChange(() => {
//     directionalLight.position.setY(options.directionalLight.y);
// });

// gui.add(options.directionalLight, 'z', -10, 10).onChange(() => {
//     directionalLight.position.setZ(options.directionalLight.z);
// });
// // add the rotation values to the GUI and listen for changes
// gui.add(options.directionalLight, 'rot_x', -Math.PI, Math.PI).onChange(() => {
//     directionalLight.rotation.x = options.directionalLight.rot_x;
// });

// gui.add(options.directionalLight, 'rot_y', -Math.PI, Math.PI).onChange(() => {
//     directionalLight.rotation.y = options.directionalLight.rot_y;
// });

// gui.add(options.directionalLight, 'rot_z', -Math.PI, Math.PI).onChange(() => {
//     directionalLight.rotation.z = options.directionalLight.rot_z;
// });


//END GUI


//START GAME, Camera Behaviour GSAP

document.querySelector('#start-game').addEventListener('click',function(){
    // //spawn obstacle in my line
    state = "spawning";
   
    camera.fov = 20;
    camera.updateProjectionMatrix();
    const initialFOV = 20;
    document.querySelector('#start-game').style.display = 'none';

})
//END CAMERA BEHAVIOUR GSAP


//Release Mode Controller
document.querySelector('#release-obstacle').addEventListener('click',function(){
    releaseMode = !releaseMode;
    if(releaseMode){
        document.querySelector('#release-obstacle').innerHTML = "Release Mode: ON"
        document.querySelector('#release-obstacle').setAttribute("enabled","true");   
    }
    else{
        document.querySelector('#release-obstacle').innerHTML = "Release Mode: OFF"
        document.querySelector('#release-obstacle').setAttribute("enabled","false");
    }
    insertOstacoli(assetLoader)
})
//END release Mode

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
            x: robotList[2].position.x - 30,
            y: robotList[2].position.y + 15,
            z: robotList[2].position.z,
            duration: 2,
            onUpdate: function(){
                camera.lookAt(robotList[2].position.x,robotList[2].position.y,robotList[2].position.z)
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
    var clips = robotGltf.animations;
    
    //mangaer for the robot 2
    myRobotCompetitionManager(clips);

    //manager for all the other robots
    for(let i = 0; i< robotList.length; i++){
        if(i != myRobotIndex){
            //robotCompetitionManager(i,clips)
        }
    }

    manageTimer()
}

function manageTimer(){
    //print in the html with id  competition-timer-value the string "Timer : " + timer + "s"
    //timer is the current date - the date when the competition started (competitionTimerDelta)
    let timer = new Date() - competitionTimerDelta;
    // document.querySelector('#competition-timer-value').innerHTML = "Timer : " + Math.floor(timer/1000) + "s";
    document.querySelector('#competition-timer-value').innerHTML = "Timer : " + (timer/1000).toFixed(2) + "s";
}

function robotCompetitionManager(robotIndex,clips){
    for(let i = 0; i< robotList.length; i++){
        //eccezione per il myrobotIndex
        if(i != myRobotIndex){
            //move the robot
            // const runnningClip = THREE.AnimationClip.findByName(clips, 'Robot_Running');
            // const runningAction = mixers[i].clipAction(runnningClip);
            // runningAction.play();
            // runningAction.weight = 0.4;

            // const punchClip = THREE.AnimationClip.findByName(clips, 'Robot_Punch');
            // const punchAction = mixers[i].clipAction(punchClip);
            // punchAction.play();
            // punchAction.weight = 0.0;

            // const jumpClip = THREE.AnimationClip.findByName(clips, 'Robot_Jump');
            // const jumpAction = mixers[i].clipAction(jumpClip);
            // jumpAction.play();
            // jumpAction.weight = 0.5;

            controlAnimation(clips,i,{
                "run": myRobotRunningWeight,
                "punch": myRobotPunchWeight,
                "jump": myRobotJumpWeight
            })


            // Set the current animation action to the new one
            // currentAnimationAction[i] = newAnimationAction;

            robotList[i].position.setX(robotList[i].position.x + 0.1)
        }
    }
}


function myRobotCompetitionManager(clips){
    //move the robot
    controlAnimation(clips,myRobotIndex,{
        "run": options.myRobotAnimationWeights.running,
        "punch": options.myRobotAnimationWeights.punch,
        "jump": options.myRobotAnimationWeights.jump
    })


    // Set the current animation action to the new one
    // currentAnimationAction[myRobotIndex] = runningAnimationAction;

    robotList[myRobotIndex].position.setX(robotList[myRobotIndex].position.x + myRobotSpeed)
    camera.position.setX(robotList[myRobotIndex].position.x - 30)

    //check if need to print an highlight mesh on the ground
    //checkForHighlightMesh_Obstacle(robotList[myRobotIndex].position.x)
    checkKeyPressed(myRobotIndex)
    checkIfNotCollideWithObstacle(myRobotIndex)
    //check if the robot is arrived
}

var highlightMeshTracker = {}
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


function checkKeyPressed(robotIndex){
    document.addEventListener('keydown', function(event) {
        //if the key pressed is the spacebar
        if(event.keyCode == 32){ //PUNCH
            //stop the current animation in the mixer[robotIndex]

            options.myRobotAnimationWeights.running = 0.2
            options.myRobotAnimationWeights.punch = 0.8
            options.myRobotAnimationWeights.jump = 0
            
            //(TODO FIXA QUA\)
            if(robotIndex == myRobotIndex){
                myRobotSpeed = 0.03
                console.log("diminuisco la velocità per pugno -->", myRobotSpeed)
            }

            //wait 200ms and then restart the running animation
            setTimeout(function(){
                options.myRobotAnimationWeights.running = 1
                options.myRobotAnimationWeights.punch = 0.0
                options.myRobotAnimationWeights.jump = 0
                myRobotSpeed = 0.3
                console.log("aumento la velocità -->", myRobotSpeed)
            }, 1000);

            
           
            checkIfNeedToDestroyObstacle(robotIndex)
        }
        //if button is shift (jump)
        if(event.keyCode == 16){ //JUMP     
            options.myRobotAnimationWeights.running = 0.2
            options.myRobotAnimationWeights.punch = 0.0
            options.myRobotAnimationWeights.jump = 0.8

            tl.clear();
            tl.to(camera.position, 
                {
                 duration: 0.2,
                 y: camera.position.y+2,
                 ease: "power2.inOut",
                 onComplete: function(){
                    tl.to(camera.position,{
                        duration: 0.2,
                        y: camera.position.y-2,
                        ease: "power2.inOut",
                    })
                 }
                }
            )
            tl.to(robotBodyList[robotIndex].position, 
                {
                 duration: 0.2,
                 y: robotBodyList[robotIndex].position.y+30,
                 ease: "power2.inOut",
                 onComplete: function(){
                    tl.to(robotBodyList[robotIndex].position,{
                        duration: 0.2,
                        y: robotBodyList[robotIndex].position.y-30,
                        ease: "power2.inOut",
                    })
                 }
                }
            )
        }
    }) 

    document.addEventListener('keyup', function(event) {
        //stop the current animation in the mixer[robotIndex]
        myRobotRunningWeight = 1.0
        myRobotPunchWeight = 0.0
        myRobotJumpWeight = 0
    })
}

function controlAnimation(clips,robotIndex,weights){
    console.log("Animation control")
    console.log(weights)
    // stop all previous actions



    const runnningClip = THREE.AnimationClip.findByName(clips, 'Robot_Running');
    const runningAction = mixers[robotIndex].clipAction(runnningClip);
    runningAction.play();
    runningAction.weight = weights.run;

    const punchClip = THREE.AnimationClip.findByName(clips, 'Robot_Punch');
    const punchAction = mixers[robotIndex].clipAction(punchClip);
    // punchAction.setLoop(THREE.LoopOnce);
    // punchAction.clampWhenFinished = true;
    punchAction.timeScale = 0.7;
    punchAction.play();
    punchAction.weight = weights.punch;

    const jumpClip = THREE.AnimationClip.findByName(clips, 'Robot_Jump');
    const jumpAction = mixers[robotIndex].clipAction(jumpClip);
    // jumpAction.setLoop(THREE.LoopOnce);
    jumpAction.play();
    jumpAction.weight = weights.jump;
}
          
function checkIfNeedToDestroyObstacle(robotIndex){
    //chech all the spawned obstacles and see if the robot is near one of them
    //if the robot is near an obstacle, destroy it
    for(let i = 0; i< spawnedObstaclesList.length; i++){
        if(spawnedObstaclesList[i].position.x - robotList[robotIndex].position.x < 10){
            //destroy the obstacle
            const force = new CANNON.Vec3(0, 10, -20);
            const point = new CANNON.Vec3(spawnedObstaclesBodyList[i].position.x, spawnedObstaclesBodyList[i].position.y, spawnedObstaclesBodyList[i].position.z); // the point to apply the force on (in local coordinates)
            spawnedObstaclesBodyList[i].applyForce(force, point);

            // scene.remove(spawnedObstaclesList[i])
            // world.removeBody(spawnedObstaclesBodyList[i])
            // spawnedObstaclesList.splice(i,1)
            // spawnedObstaclesBodyList.splice(i,1)
            // console.log("destroyed obstacle")
        }
    }
}

function checkIfNotCollideWithObstacle(robotIndex){
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
    console.log("Collisione di un robot")
    //check if spawnedObstaclesBLID contains the id of the e.target
    console.log(e.body.id)
    if(spawnedObstaclesBLID.includes(e.body.id)){
        //reduce the speed of the robot
        console.log("Collisione di un robot"+e.body.id+" con un ostacolo spawnato "+e.target.id)

        //todo diminuire la velocita del robot corretto e non sempre del myrobotindex
        if(reducingSpeed == false && myRobotSpeed > 0.1){
            console.log("diminuisco la velocita -->",myRobotSpeed)
            myRobotSpeed -= 0.03
        }else{
            console.log("Smetto di diminuire la velocita -->",myRobotSpeed)
            reducingSpeed = true
        }
        
    }

}


function startCompetition(){
    // Stop current animation
    var robotTimeline = []
    
    var cameraTimeline = gsap.timeline();
    for (let i = 0 ; i< robotList.length; i++){
        cameraTimeline.clear();
        currentAnimationAction[i].stop();

        const clips = robotGltf.animations;
        const newClip = THREE.AnimationClip.findByName(clips, 'Robot_Running');

        // Create a new animation action with the new clip and play it
        const newAnimationAction = mixers[i].clipAction(newClip);
        newAnimationAction.play();

        // Set the current animation action to the new one
        currentAnimationAction[i] = newAnimationAction;

        robotTimeline.push(gsap.timeline());
       

        robotTimeline[i].clear();
        
        
        currentAnimationAction[i].timeScale = ((i+1)/10)*2 ; // todo --> definire velocita di animazione corsa

        robotTimeline[i].to(robotList[i].position, {  // Add camera.position here
            x: 110,  // Increment z by 20
            duration: (i+1)*10, //todo --> definire velocita di corsa
            onComplete: function() {
                console.log('Competizione ---> complete');
                currentAnimationAction[i].stop()
            }
        });
    }
}

var countDownSoundURL = require('url:../assets/sounds/countdown.mp3');
var startSoundURL = require('url:../assets/sounds/start.mp3');
var countDownSound = new Audio(countDownSoundURL);
var startSound = new Audio(startSoundURL);
var playedSoundsCountdown = [false,false,false,false];

function countDownCompetitionManagement(time){
    var countDown = document.querySelector('#countdown-current-value')
    document.querySelector('#start-game').style.display = 'none';
    if(countDown){
        if(time>1){
            countDown.innerHTML = "3";
            
            if(!countDownSound.isPlaying && !playedSoundsCountdown[0]){
                countDownSound.play();
                playedSoundsCountdown[0] = true;
            }
        }
        if(time>2){
            countDown.innerHTML = "2";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[1]){
                countDownSound.play();
                playedSoundsCountdown[1] = true;
            }
        }
        if(time>3){
            countDown.innerHTML = "1";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[2]){
                countDownSound.play();
                playedSoundsCountdown[2] = true;
            }
        }
        if(time>4){
            countDown.innerHTML = "VIA";
            if(!startSound.isPlaying && !playedSoundsCountdown[3]){
                startSound.play();
                playedSoundsCountdown[3] = true;
            }
        }
    }
}
//END COMPETITIOn

const clock =  new THREE.Clock();
function animate() {
    world.step(timeStep);

    //State management
    switch(state){
        case 0:
            //attach a listener for collide to the robotBodyList
            for(let i = 0; i < robotBodyList.length; i++){
                robotBodyList[i].addEventListener("collide", robotCollisonHandler);
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
                competitionTimerDelta = Date.now();

                state='running';
            }else{
                managePreCompetition()
            }
            break
        case 'running':
            manageRunning();
            break;
    }
    

    // manage robot physics
    if(robotList.length>0){
        for(let i = 0; i < robotList.length ; i++){
            if (robotMesh && robotBodyList[i]) {
                robotBodyList[i].position.copy(robotList[i].position);
                robotBodyList[i].quaternion.copy(robotList[i].quaternion);
            }
        }
    }

    linkMeshesAndBody(ostacoliList,ostacoliBodyList)
    linkMeshesAndBody(spawnedObstaclesList,spawnedObstaclesBodyList)
    
    const delta = clock.getDelta();
    mixers.forEach(function(mixer) {
        mixer.update(delta);
    });
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
    camera.position.set(100, 30, 0);
    camera.lookAt(-100,0,0)
    manageRobots(assetLoader,5,{width:100,heigth:100})
   
    createScuderie(assetLoader,5,{width:100,heigth:100})
    createPaglia(assetLoader,5)
    createWalls(assetLoader,38,6,{width:100,heigth:100})
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
                
                    // Create a cannon.js body for each wall
                    // const wallBody = new CANNON.Body({ mass: 0 });
                    // wallBody.addShape(wallShape);
                    // wallBody.position.set(0, 0, i * wallSpacing);
                    // world.addBody(wallBody);
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
                material: robotPhysMat ,
                type : CANNON.Body.KINEMATIC,
            });
            cannonBodyRobot.name = "robot_0" ;
            console.log("cannonBodyRobot.name "+cannonBodyRobot.name)
            console.log("cannonBodyRobot.id ",cannonBodyRobot.id)
            if(myRobotIndex == 0){
                myRobotID = cannonBodyRobot.id;
                console.log("myRobotID ",myRobotID)
            }
            robotBodyList.push(cannonBodyRobot);
        
            // world.addBody(robotBodyList[0]);
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
                    // position: new CANNON.Vec3(robotBodyList[0].position.x +(i *15),robotBodyList[0].position.y,robotBodyList[0].position.z),
                    position: new CANNON.Vec3(robotList[0].position.x,robotList[0].position.y,robotList[0].position.z +(i *15)),
                    material: robotPhysMat ,
                    type : CANNON.Body.KINEMATIC,
                })
                robotBodyCANNON.name = 'robot_'+i;
                console.log("robotBodyCANNON.name",robotBodyCANNON.name);
                console.log("robotBodyCANNON.id",robotBodyCANNON.id);
                if(myRobotIndex == i){
                    myRobotID = robotBodyCANNON.id;
                    console.log("myRobotID ",myRobotID)
                }
                robotBodyList.push(robotBodyCANNON);
                world.addBody(robotBodyList[i]);
                
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
var intersects;
function mouseMoveAddOstacoli(e){
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObject(planeMesh);
    if(intersects.length > 0) {
        const intersect = intersects[0];
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
        
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
        assetLoader.load(ostacolo1.href, function(gltf){
            ostacolo1Mesh = gltf.scene.children[0];
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
                        ostacolo1Clone.scale.set(30,30,30);
                        ostacolo1Clone.position.copy(highlightMesh.position);
                        scene.add(ostacolo1Clone);
                        ostacoliList.push(ostacolo1Clone)
                        highlightMesh.material.color.setHex(0xFF0000);
        
        
                        const ostacoliPhysMat = new CANNON.ContactMaterial(new CANNON.Material(), new CANNON.Material(), { friction: 0.0, restitution: 0.0 });
                        const boundingBox = new THREE.Box3().setFromObject(ostacolo1Clone);
                
                        // Calculate the size of the box
                        const size = new CANNON.Vec3();
                        size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
                        size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
                        size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);
        
                        // Create the body using the size
                        const shape = new CANNON.Box(size);
                        let currentLeghtofOstacoli = ostacoliList.length
                        ostacoliBodyList.push(new CANNON.Body({ 
                            mass: 1, 
                            shape: new CANNON.Box(shape.halfExtents), 
                            // position: new CANNON.Vec3(robotBodyList[0].position.x +(i *15),robotBodyList[0].position.y,robotBodyList[0].position.z),
                            position: new CANNON.Vec3(ostacoliList[currentLeghtofOstacoli-1].position.x,ostacoliList[currentLeghtofOstacoli-1].position.y,ostacoliList[currentLeghtofOstacoli-1].position.z),
                            material: ostacoliPhysMat ,
                            type : CANNON.Body.STATIC
                        }));        
                        
                        //tolgo i soldi
                        currentPrice -= 10;
                        cash_val.innerHTML = currentPrice;

                        //aggiungo ostacolo al mondo
                        world.addBody(ostacoliBodyList[currentLeghtofOstacoli]);
                        ostacoliList[ostacoliList.length] = {...ostacoliList[ostacoliList.length-1],id_cannon : ostacoliBodyList[currentLeghtofOstacoli-1].id}                
                        }
                    }
                }
                
            }else{
                //rimuovi ostacolo piazzato     
                console.log(objectExist) 
                let ostacoliList_obj_index =  ostacoliList.findIndex((element) => element.uuid === objectExist.uuid)
                if(ostacoliList_obj_index != -1){
                    scene.remove(objectExist);  
                    ostacoliList = ostacoliList.slice(0,ostacoliList_obj_index).concat(ostacoliList.slice(ostacoliList_obj_index+1));
                    highlightMesh.material.color.setHex(0xFFFFFF);

                    currentPrice += 10;
                    cash_val.innerHTML = currentPrice;
                }
                
                
                let cannon_id = objectExist.id_cannon
                //rimuovi body dal mondo
                let ostacoliBodyList_index = ostacoliBodyList.findIndex((element) => element.id === cannon_id)
                if(ostacoliBodyList_index != -1){
                    ostacoliBodyList = ostacoliBodyList.slice(0, ostacoliBodyList_index ).concat(ostacoliBodyList.slice(ostacoliBodyList_index+1));
                    world.removeBody(objectExist)
                }
                //console.log(ostacoliBodyList_index)
                
                console.log("ostacoliList.length "+ostacoliList.length+"    ---    ostacoliBodyList_index.length   "+ostacoliBodyList.length)
            }
        });
    }
    
    

    //END AGGIUNGI OSTACOLI
}

function check_possible_release_ostacolo(x,z){
    console.log("x_pos "+x+"   z_pos "+z)
    if(z != 30.5 && z != 15.5 && z != -15.5 && z != -29.5 ){ 
        return false;
    }
    if(x < -100 || x > 100){
        return false;
    }
    return true;
}
//END CREATIVE MODE

//Spawn ostacoli
var spawned = false; //to communicate that the spawning is finished
var cameraSpawningFinished = false; //to communicate that the spawning camera animation is finished
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
                    name: "obstacle_"+i,
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
    var cash_val = document.querySelector("#cash-value");
    cash_val.innerHTML =  currentPrice;
}
//----------------- END ONLOAD EVENTS ------------