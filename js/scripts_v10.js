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



//--------------START -----------------
const timeStep = 1 / 60;
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -100, 0)
});

//---------------- COSTANTI ----------------
let currentPrice = 40;
const settings = {
    spawnAmount: 2,
}
//----------------  END COSTANTI ---------------

//-------------- ASSETS -----------
const scuderia = new URL('../assets/Houses_SecondAge_1_Level1.gltf', import.meta.url)
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
var myRobotSpeed = 0.3

var competitionTimerStart = 0;
var timerDelta = 0;

//Sounds variables
var countDownSoundURL = require('url:../assets/sounds/countdown.mp3');
var startSoundURL = require('url:../assets/sounds/start.mp3');
var popURL = require('url:../assets/sounds/pop.mp3');
var trashURL = require('url:../assets/sounds/trash.mp3');
var eyeOfTheTigerURL = require('url:../assets/sounds/eyeofthetiger.mp3');
var countDownSound = new Audio(countDownSoundURL);
var startSound = new Audio(startSoundURL);
var popSound = new Audio(popURL);
var trashSound = new Audio(trashURL);
var eyeOfTheTigerSound = new Audio(eyeOfTheTigerURL);
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
const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(), //infinite plane
    shape: new CANNON.Box(new CANNON.Vec3(150, 0.1, 50)),
    position: new CANNON.Vec3(0, -0.1, 0),
    material: groundPhysMat
});
world.addBody(groundBody);

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
        indexCameraFollows: myRobotIndex,
        camera_view: 'third_person',
        spawnAnimationCameraDuration: 6,
        buttonsInstructionsFadeDuration: 7,
    },
    settings: {
        sound_enabled: true,
        physic_debug: false,
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


//--- Cannon debugger
const cannonDebugger = new CannonDebugger(scene, world,{
    onUpdate: (body,mesh) => {
        if(options.settings.physic_debug == true){
            mesh.visible = true;
        }else{
            mesh.visible = false;
        }
    }
});


//COMPETITION
function managePreCompetition(){
    let countDownElement = document.querySelector('#countdown-current-value')
    countDownElement.style.opacity = 1;

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
        countDownStarted = true;
        tl.to(countDownElement,{
            duration: 4.5,
            onUpdate: function(){
                countDownCompetitionManagement(tl.time());
            },
            onComplete: function() {
                console.log('Countdown ---> complete');
                countDownFinished = true;
            }
        })
    }else{
        for(let i = 0; i< robotArray.length; i++){
            robotArray[i].mixer.stopAllAction();
        }
    }
}

function countDownCompetitionManagement(time){
    var countDown = document.querySelector('#countdown-current-value')
    document.querySelector('#start-game').style.display = 'none';
    if(countDown){
        if(time>1 && time<2){
            countDown.innerHTML = "3";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[0]  && options.settings.sound_enabled == true){
                countDownSound.play();
                playedSoundsCountdown[0] = true;
            }
        }
        if(time>= 2 && time<3){
            countDown.innerHTML = "2";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[1] && options.settings.sound_enabled == true){
                countDownSound.play();
                playedSoundsCountdown[1] = true;
            }
        }
        if(time>3 && time<4){
            countDown.innerHTML = "1";
            if(!countDownSound.isPlaying && !playedSoundsCountdown[2] && options.settings.sound_enabled == true){
                countDownSound.play();
                playedSoundsCountdown[2] = true;
            }
        }
        if(time>=4){
            countDown.innerHTML = "GO!";
            if(!startSound.isPlaying && !playedSoundsCountdown[3] && options.settings.sound_enabled == true){
                startSound.play();
                playedSoundsCountdown[3] = true;
            }
        }
    }
}

function hideCountdown(){
    let countDownElement = document.querySelector('.countdown-competition');
    if(countDownElement){
        countDownElement.classList.add('hide-animation');
        document.querySelector('.container-button-settings').classList.remove('d-none');
    }
    setTimeout(function(){
        countDownElement.remove();
        
    }
    ,3000);

}

function manageRunning(){
    myRobotCompetitionManager();
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


function robotCompetitionManager(robotIndex){
    if(robotIndex != myRobotIndex){
        robotArray[robotIndex].mesh.position.setX(robotArray[robotIndex].mesh.position.x + robotArray[robotIndex].speed)
        robotArray[robotIndex].physicsBody.position.x = (robotArray[robotIndex].physicsBody.position.x + robotArray[robotIndex].speed)
    }
}


function myRobotCompetitionManager(){ //function manager of the behaviour of my robot
    robotArray[myRobotIndex].mesh.position.setX(robotArray[myRobotIndex].mesh.position.x + robotArray[myRobotIndex].speed )
    if(options.gameConstants.camera_view == 'third_person'){
        camera.position.setX(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x - 30)
        camera.position.setZ(robotArray[options.gameConstants.indexCameraFollows].mesh.position.z )
    }else{
        camera.position.setX(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x + 50)
        camera.position.setY(robotArray[options.gameConstants.indexCameraFollows].mesh.position.y + 20)
        camera.position.setZ(50)
    }
    sphere.position.x = (robotArray[myRobotIndex].mesh.position.x)
    sphere.position.y = (robotArray[myRobotIndex].mesh.position.y + 8)

    camera.lookAt(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x,robotArray[options.gameConstants.indexCameraFollows].mesh.position.y,robotArray[options.gameConstants.indexCameraFollows].mesh.position.z)
    orbit.target.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x,robotArray[options.gameConstants.indexCameraFollows].mesh.position.y,robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
}

function checkForWinner(){
    if(!winnerScreen){
        for (let i = 0; i < robotArray.length; i++) {
            if(robotArray[i].mesh.position.x >= 120){
                winnerScreen = true
                winnerRobot = i;
                winnerTimer = timerDelta;
                printWinnerScreen();
                state = "winner";
            }
        }
    }
}

function printWinnerScreen(){
    for (let i = 0; i < robotArray.length; i++) {
        robotArray[i].mixer.stopAllAction();
    }

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




function setRobotInitialSpeed(){
    for(let i = 0; i < robotArray.length; i++){
        if(i == myRobotIndex){
            robotArray[i].speed = myRobotSpeed
            robotArray[i].backup_speed = myRobotSpeed
            robotArray[i].initial_speed = myRobotSpeed
        }else{
            //random speed between 0.1 and 0.3
            robotArray[i].speed  = Math.random() * (0.3 - 0.1) + 0.1;
            robotArray[i].initial_speed = robotArray[i].speed
            robotArray[i].backup_speed = robotArray[i].speed
        }
    }
}

var reducingSpeed = false
function robotCollisonHandler(e){
    let spawnedObstacle = obstacleArray.filter(obstacle => obstacle.is_spawned == true);
    let index = spawnedObstacle.findIndex(obstacle => obstacle.physicsBody.id == e.body.id);
    if(index != -1){
        if(reducingSpeed == false && robotArray[myRobotIndex].speed  > 0.1){
            robotArray[myRobotIndex].speed -= 0.03
            console.log("diminuisco la velocita -->", robotArray[myRobotIndex].speed)
        }else{
            reducingSpeed = true
        }
    }
}





function animate() {
    world.step(timeStep);
    TWEEN.update();

    cannonDebugger.update();
    //State management
    switch(state){
        case 'spawning':
            document.querySelector('.message-spawning').classList.remove('d-none');
            spawnRandomObstacles(tl,settings.spawnAmount);
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
        setRobotInitialSpeed();
        camera.position.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x+30, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y + 14, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
        camera.lookAt(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x,robotArray[options.gameConstants.indexCameraFollows].mesh.position.y,robotArray[options.gameConstants.indexCameraFollows].mesh.position.z)
        orbit.target.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x,robotArray[options.gameConstants.indexCameraFollows].mesh.position.y,robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
    }

    createStables(assetLoader,5,{width:100,heigth:100})
    createGrass(assetLoader,5)
    createWalls(assetLoader,38,6,{width:100,heigth:100})

    if(Robot.loaded){
        for(let i = 0; i < robotArray.length; i++){
            if(i == myRobotIndex){
                console.log("adding collision handler to my robot")
                robotArray[i].physicsBody.addEventListener("collide", robotCollisonHandler);
            }
            else{
                console.log("adding collision handler to robot "+i)
                robotArray[i].physicsBody.addEventListener("collide", function(e){
                    robotArray[i].jumpAnimation()
                    robotArray[i].speed = robotArray[i].backup_speed;
                    console.log("Set speed to "+robotArray[i].speed)
                });
            }
        }
        state = 'waitingForSpawn'
    }
}

const geometry = new THREE.SphereGeometry( 1, 32, 32 );
const material = new THREE.MeshPhysicalMaterial( {
    color: 0x00feff,
    metalness: 0,
    roughness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    reflectivity: 1,
    envMapIntensity: 1,
    premultipliedAlpha: true
} );
const sphere = new THREE.Mesh( geometry, material );
function createRobots(){
    //Create the robots
    for(let i = 0; i < options.gameConstants.num_robots; i++){
        robotArray.push(new Robot(scene,world, -125, 0.1,((-30)+(i*15))));
        if(i == myRobotIndex) robotArray[i].is_my_robot = true;

        if(i == myRobotIndex){
            sphere.position.set(robotArray[i].mesh.position.x,robotArray[i].mesh.position.y+8,robotArray[i].mesh.position.z)
            scene.add( sphere )
        };
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
                    wallList.push(wall);
                    scene.add(wall);

                    //create a cannonjs body for the wall
                    const boundingBox = new THREE.Box3().setFromObject(wallModel);
                    const size = new CANNON.Vec3();
                    size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
                    size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
                    size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);
                    const shape = new CANNON.Box(size);
                    const wallBody = new CANNON.Body({
                        mass: 30 ,
                        shape: shape,
                        position: new CANNON.Vec3(wall.position.x, wall.position.y, wall.position.z),
                        type: CANNON.Body.STATIC
                    });
                    world.addBody(wallBody);
                    wallBodyList.push(wallBody);
                }
            }
            console.log('Walls added to the scene')
        }
    });
}

function createStables(assetLoader,num_lines,world_size){
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

function createGrass(assetLoader, num_lines) {
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
          // create and add grass meshes
          addGrassMeshes(pagliaMesh, -120, 0.2, -35, 2, 51);
          addGrassMeshes(pagliaMesh.clone(), -120, 0.2, -19.7, 2, 51, { x: 2.7 });
          addGrassMeshes(pagliaMesh.clone(), -120, 0.2, -4.7, 2, 51, { x: 2.7 });
          addGrassMeshes(pagliaMesh.clone(), -120, 0.2, 10.5, 2, 51, { x: 2.7 });
          addGrassMeshes(pagliaMesh.clone(), -120, 0.2, 25.5, 2, 51, { x: 2.7 });
        }
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );
}

function addGrassMeshes(pagliaMesh, startX, startY, startZ, numLayers, numColumns, options = {} ) {
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



//FOR CREATIVE MODE MANAGING
var highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3,3),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: false
    })
);
function mouseMoveAddObstacles(e){
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObject(planeMesh);
    if(intersects.length > 0) {
        const intersect = intersects[0];
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor();

        highlightMesh.position.set(highlightPos.x, 0.1, highlightPos.z);
        highlightMesh.rotation.x = Math.PI / 2;

        const objectExist = obstacleArray.find(function(object) {
            return (object.mesh.position.x + 3 >= highlightMesh.position.x ) && (object.mesh.position.x - 3 < highlightMesh.position.x)
            && (object.mesh.position.z + 3 >= highlightMesh.position.z) && (object.mesh.position.z - 3 < highlightMesh.position.z)
        });

        const possibleToRelease =  isReleasable(highlightMesh.position.x,highlightMesh.position.z );

        if(!objectExist && possibleToRelease)
            highlightMesh.material.color.setHex(0xFFFFFF); //white
        else
            highlightMesh.material.color.setHex(0xFF0000); //red
    }
}

function insertObstacles(){
    let releaseMode = document.querySelector('#release-obstacle').getAttribute("enabled");

    if(releaseMode == "false"){
        scene.remove(highlightMesh)
    }else{
        scene.add(highlightMesh)
        window.addEventListener('mousemove', mouseMoveAddObstacles );
        window.addEventListener('mousedown', mouseDownRelease );
    }
}
function mouseDownRelease(){
    var cash_val = document.querySelector("#cash-value");

    const objectExist = obstacleArray.find(function(object) {
        return (object.mesh.position.x + 3 >= highlightMesh.position.x ) && (object.mesh.position.x - 3 < highlightMesh.position.x)
        && (object.mesh.position.z + 3 >= highlightMesh.position.z) && (object.mesh.position.z - 3 < highlightMesh.position.z)
    });




    if(!objectExist) {
        if(currentPrice >= 10){
            if(intersects.length > 0) {
                const possibleToRelease =  isReleasable(highlightMesh.position.x,highlightMesh.position.z );
                if(possibleToRelease){
                    let ostacolo = new Obstacle(scene,world,highlightMesh.position.x,highlightMesh.position.y+10,highlightMesh.position.z,false);
                    if(options.settings.sound_enabled==true ){
                        popSound.play();
                    }
                    currentPrice -= 10;
                    cash_val.innerHTML = currentPrice;

                    //aggiungo ostacolo al mondo
                    obstacleArray.push(ostacolo);
                    console.log("Ostacoli inseriti-> ",obstacleArray.length)
                }
            }
        }else{
            let budgetFinished = document.querySelector("#budget-finished");
            budgetFinished.classList.remove("d-none");
            budgetFinished.style.opacity = 1;
            new TWEEN.Tween(budgetFinished.style.opacity)
                .to(0, 1000)
                .onComplete(function(){
                    document.querySelector("#budget-finished").classList.add("d-none");
                })
                .start()
        }

    }else{
        //rimuovi ostacolo piazzato
        let ostacoliList_obj_index = obstacleArray.findIndex((element) => element.mesh.uuid === objectExist.mesh.uuid)
        if(ostacoliList_obj_index != -1){
            world.removeBody(obstacleArray[ostacoliList_obj_index].physicsBody)
            scene.remove(obstacleArray[ostacoliList_obj_index].mesh);
            if(options.settings.sound_enabled==true){
                trashSound.play();
            }
            console.log("Obstacle array before remove: ",obstacleArray)
            obstacleArray = obstacleArray.slice(0,ostacoliList_obj_index).concat(obstacleArray.slice(ostacoliList_obj_index+1));
            console.log("Obstacle array after remove: ",obstacleArray)

            highlightMesh.material.color.setHex(0xFFFFFF);
            currentPrice += 10;
            document.querySelector("#budget-finished").classList.add("d-none");
            cash_val.innerHTML = currentPrice;
        }
    }
}
function isReleasable(x,z){
    if(z != 30 && z != 15 && z != -15 && z != -30 ){
        return false;
    }
    if(x < -100 || x > 100){
        return false;
    }
    return true;
}
//END CREATIVE MODE

//Spawn obstacles
function spawnRandomObstacles(tl, spawnAmount) {
    if(!spawned){
        spawned = true;
        console.log("Spawning ostacoli ....")
        tl.clear();
        const obstacleDistance = 20;

        var center = { x: 0, y: 0, z: 0 };
        var radius = 300;
        var duration = options.gameConstants.spawnAnimationCameraDuration;

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


        let previousObstacleX = []
        for (let i = 0; i < spawnAmount; i++) {
            //ensure that the obstacles are not spawned too close to each other
            let position =  Math.floor(Math.random() * (100 - (-100) + 1)) + (-100)
            while(isTooClose(position,previousObstacleX,obstacleDistance)){
                position =  Math.floor(Math.random() * (100 - (-100) + 1)) + (-100);
            }
            previousObstacleX.push(position);
            let ostacolo = new Obstacle (scene,world,position,40,0,true)
            obstacleArray.push(ostacolo)
        }

    }
}

function isTooClose(position,previousObstacleX,distance){
    for(let i = 0; i < previousObstacleX.length; i++){
        if(Math.abs(position - previousObstacleX[i]) < distance){
            return true;
        }
    }
    return false;
}

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
                    meshes[i].mesh.position.y -= Obstacle.yBodyDisplacement;
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
    if(currentPrice > 0){
        alert("You are starting the game but you didn't spend all of your budget! \nThis will make the others robot life easier!")
    }
    if(options.settings.sound_enabled==true){
        eyeOfTheTigerSound.play();
    }

    state = "spawning";
    camera.fov = 20;
    camera.updateProjectionMatrix();
    document.querySelector('#start-game').style.display = 'none';
    document.querySelector('.initial-screen').style.display = 'none';
    


    document.querySelector('#space-img').classList.remove('d-none');
    gsap.to('#space-img',{
        opacity: 0,
        duration: options.gameConstants.buttonsInstructionsFadeDuration,
        onComplete: function(){
            document.querySelector('#space-img').style.display = 'none';
        }
    })

    document.querySelector('#shift-img').classList.remove('d-none');
    gsap.to('#shift-img',{
        opacity: 0,
        duration: options.gameConstants.buttonsInstructionsFadeDuration,
        onComplete: function(){
            document.querySelector('#space-img').style.display = 'none';
        }
    })

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
    insertObstacles(assetLoader)
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


// -------For the settings menu
document.querySelector('#settings-button').addEventListener('click',function(){
    document.querySelector('.initial-screen').classList.add('d-none');
    document.querySelector('.settings-container').classList.remove('d-none');
})
document.querySelector('#settings-button').addEventListener('mouseenter',function(){
    document.querySelector('#settings-button').classList.add('fa-spin');
})
document.querySelector('#settings-button').addEventListener('mouseleave',function(){
    document.querySelector('#settings-button').classList.remove('fa-spin');
})
document.querySelectorAll('input[name="camera-view"]').forEach(function(input){
    input.addEventListener('change',function(){
        options.gameConstants.camera_view = this.value;
        console.log("camera view changed to "+options.gameConstants.camera_view)
    })
})
document.querySelectorAll('input[name="debug"]').forEach(function(input){
    input.addEventListener('change',function(){
        if(this.value == 'true') options.settings.physic_debug = true;
        else options.settings.physic_debug = false;
        
        console.log("debug changed to "+options.settings.physic_debug)
    })
})

document.querySelectorAll('input[name="audio"]').forEach(function(input){
    input.addEventListener('change',function(){
        //if this.value is true, then the debug is enabled
        if(this.value == 'true') options.settings.sound_enabled = true;
        else options.settings.sound_enabled = false;
    })
})

// to .change-camera-view button change the camera view from options
document.querySelector('#change-camera-view').addEventListener('click',function(){
    if(options.gameConstants.camera_view == 'third_person') options.gameConstants.camera_view = 'whole_view';
    else options.gameConstants.camera_view = 'third_person';
})

//the same to #change-sound
document.querySelector('#change-sound').addEventListener('click',function(){
    options.settings.sound_enabled = !options.settings.sound_enabled;
})

document.querySelector('#settings-exit').addEventListener('click',function(){
    document.querySelector('.initial-screen').classList.remove('d-none');
    document.querySelector('.settings-container').classList.add('d-none');
})





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

//----------------- END EVENT LISTENERS ----------