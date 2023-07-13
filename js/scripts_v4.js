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
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundPhysMat = new CANNON.Material({
    friction: 10,
});
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(), //infinite plane
    //mass: 10
    // shape: new CANNON.Box(new CANNON.Vec3(100, 100, 0.1)),
    type: CANNON.Body.STATIC,
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
//-------------- END ASSETS -----------

//GLOBAL VARIABLES
let state = 0;
var releaseMode = false;

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

// Camera positioning
camera.position.set(-100, 20, 40);
// camera.lookAt(100, 1000, 1000);
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
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = +50;
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
    }
}
// const gui = new dat.GUI();

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
const tl = gsap.timeline();
document.querySelector('#start-game').addEventListener('click',function(){
    //TODO define REST as current animation
    for (let i = 0 ; i< robotList.length; i++){
        currentAnimationAction[i].play();
        //reset robot position
        robotList[i].position.set(robotList[0].position.x,robotList[0].position.y,robotList[0].position.z +(i *15))
    }
        
    //spawn obstacle in my line
    state = "spawning";
    if(state == "spawning"){
        spawnOstacoli(tl,settings.spawnAmount);
    }

    camera.fov = 20;
    camera.updateProjectionMatrix();
    const initialFOV = 20;
    document.querySelector('#start-game').style.display = 'none';

   
    //reset timeline
    tl.clear();

    //reset countdown
    let startingCountDownOpacity = 1;
    let countDownElement = document.querySelector('#countdown-current-value')
    countDownElement.style.opacity = 1;
    countDownElement.innerHTML = "3";

    if(state == "running"){
        tl.to(camera.position,{
            x: -120,
            y: 25,
            z: 40,
            duration: 3,
            onUpdate: function(){
                options.camera.rot_x = camera.rotation.x
                options.camera.rot_y = camera.rotation.y
                options.camera.rot_z = camera.rotation.z
                // Calculate the new field of view based on the progress of the second .to animation
        
                camera.fov = 30;
                camera.updateProjectionMatrix();
                camera.lookAt(-120,0,0)
                if(tl.time() >= 1) countDownCompetitionManagement(tl.time());
            },
            onComplete: function() {
                console.log('Camera 1 ---> complete');
            }
        })
        .to(camera.position,{
            x: 220,
            y: 20,
            z: 40,
            duration: 2,
            onUpdate: function(){
                // options.camera.rot_x = camera.rotation.x
                // options.camera.rot_y = camera.rotation.y
                // options.camera.rot_z = camera.rotation.z
                camera.lookAt(-100, 0, 0)

                if(tl.time() >= 1) countDownCompetitionManagement(tl.time());
                countDownElement.style.opacity = 1 - ((tl.time() - 3) / 2)
                document.querySelector('#start-game').style.display = 'block';
            },
            onComplete: function() {
                console.log('Camera 2 ---> complete');
                startCompetition();    
            }
        })
        // .to(camera.position,{

        //     x: 100,
        //     y: 10,
        //     z: 0,
        //     duration: 2,
        //     onUpdate: function(){
        //         camera.lookAt(-40,0,0)
        //         // Calculate the new field of view based on the progress of the second .to animation
        //         const progress = (tl.time() - 4) / 2; // 4 is the duration of the first .to animation
        //         const newFOV = initialFOV + (60 - initialFOV) * progress;
        //         countDownElement.style.opacity = 1 - ((tl.time() - 4) / 2)
        //         camera.fov = newFOV;
        //         camera.updateProjectionMatrix();
        //         document.querySelector('#start-game').style.display = 'block';
        //     },
        //     onComplete: function() {
        //         console.log('Camera intro ---> complete');
        //         startCompetition();    
        //     }
        // });
    }
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

    
    
    // cameraTimeline.to(camera.position, {  // Add camera.position here
    //     // x: 30,
    //     x: 80,
    //     y: 30,
    //     duration: 1,
    //     onUpdate: function() {
    //         camera.lookAt(0,1,0)
    //     },
    //     onComplete: function() {
    //         console.log('Rotazione eseguita ---> complete');
    //     },
    // })
    // .to(camera.position, {
    //     x: 0,
    //     y: 30,
    //     duration: 1,
    //     onUpdate: function() {
    //         camera.lookAt(30,1,0)
    //     },
    //     onComplete: function() {
    //       console.log('Rotazione eseguita ---> complete');
    //     }
    //   });

   // gsap.to([robotTimeline, cameraTimeline], { duration: 1, time: 1 });
}


function countDownCompetitionManagement(time){
    var countDown = document.querySelector('#countdown-current-value')
    document.querySelector('#start-game').style.display = 'none';
    if(time>1){
        countDown.innerHTML = "3";
    }
    if(time>2){
        countDown.innerHTML = "2";
    }
    if(time>3){
        countDown.innerHTML = "1";
    }
    if(time>4){
        countDown.innerHTML = "VIA";
    }
}
//END COMPETITIOn

const clock =  new THREE.Clock();
function animate() {
    world.step(timeStep);
    //controls.update(clock.getDelta());

    // planeMesh.position.copy(groundBody.position);
    // planeMesh.quaternion.copy(groundBody.quaternion);


    // if (scuderiaMesh && scuderiaBody) {
    //     scuderiaMesh.position.copy(scuderiaBody.position);
    //     scuderiaMesh.quaternion.copy(scuderiaBody.quaternion);
    //     console.log(scuderiaMesh.position.z)
    // }

     
    
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
    // Apply a force to the body
    const force = new CANNON.Vec3(0, 1, -1); // the force to apply
    // if(spawnedObstaclesBodyList[0]){
    //     const point = new CANNON.Vec3(spawnedObstaclesBodyList[0].position.x, spawnedObstaclesBodyList[0].position.y, spawnedObstaclesBodyList[0].position.z); // the point to apply the force on (in local coordinates)
    //     spawnedObstaclesBodyList[0].applyForce(force, point);
    //     spawnedObstaclesList[0].scale.set(50,50,50)
    // }
        

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
        const robotPhysMat = new CANNON.ContactMaterial(new CANNON.Material(), new CANNON.Material(), { friction: 0.0, restitution: 0.0 });

        if(robotMesh){
            const boundingBox = new THREE.Box3().setFromObject(model);

            // Calculate the size of the box
            const size = new CANNON.Vec3();
            size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
            size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
            size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);

            // Create the body using the size
            const shape = new CANNON.Box(size);
            robotBodyList.push(new CANNON.Body({ 
                mass: 1, 
                shape: new CANNON.Box(shape.halfExtents), 
                position: new CANNON.Vec3(-38,0.1,-32),
                material: robotPhysMat ,
                type : CANNON.Body.KINEMATIC
            }));
        
            world.addBody(robotBodyList[0]);
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
                
                robotBodyList.push(new CANNON.Body({ 
                    mass: 1, 
                    shape: new CANNON.Box(shape.halfExtents), 
                    // position: new CANNON.Vec3(robotBodyList[0].position.x +(i *15),robotBodyList[0].position.y,robotBodyList[0].position.z),
                    position: new CANNON.Vec3(robotList[0].position.x,robotList[0].position.y,robotList[0].position.z +(i *15)),
                    material: robotPhysMat ,
                    type : CANNON.Body.KINEMATIC
                }));
                //currentRobotBody.addShape(new CANNON.Box(shape.halfExtents))
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

function unregisterEventsOstacoli(){
    window.removeEventListener('mousemove')
    window.removeEventListener('mousedown')
}

function check_possible_release_ostacolo(x,z){
    //definizione delle linee di rilascio, se la posizione del mouse è su una di queste linee allora è possibile rilasciare l'ostacolo

    console.log("x_pos "+x+"   z_pos "+z)

    //if z is not in list = 30.5, 14.5 ,0.5, -14.5, -30.5 return false
    if(z != 30.5 && z != 15.5 && z != -15.5 && z != -29.5 ) return false
    return true
}
//END CREATIVE MODE

//Spawn ostacoli
function spawnOstacoli(tl, spawnAmount) {
    console.log("Start process spawn ostacoli")
    let spawned = 0;
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

        
        // spawn obstacles at random positions between the start and end points
        for (let i = 0; i < spawnAmount; i++) {
            const position = Math.random() * (endPoint - startPoint - obstacleDistance) + startPoint + obstacleDistance / 2;
            // spawn obstacle at position
            // add the new obstacle to the timeline
        
            // create a clone of the obstacle mesh
            const obstacleClone = ostacolo1Mesh.clone();
            //define a cannon body for the obstacle
            var obstacleBody = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(0.1,0.1,0.1)),
                mass: 200,
                }
            );

            // set the position of the clone
            obstacleClone.scale.set(30,30,30);
            obstacleClone.position.set(position, 40, 0);
            obstacleBody.position.copy(obstacleClone.position);
            spawnedObstaclesList.push(obstacleClone)
            spawnedObstaclesBodyList.push(obstacleBody)
            scene.add(obstacleClone);
            world.addBody(obstacleBody);

    
            

            //TODO HERE
            // tl.to(obstacleClone.position, { y: 0, duration: 5, ease: "linear" }, 0);
            // tl.to(camera.position,{y: 30, z: obstacleClone.position.z + 100, duration: 5, ease: "linear"},0)
        }
    },function(progress){
        // console.log(progress)
        // TODO IMPLEMENTARE LOADER
    },
    function(error){
        console.log(error)
    })
    

    tl.to(camera.position,
        { 
          x: -100,
          y: 0,
          duration: 5,
          onUpdate: function(){
            camera.position.set(obstacleClone.position.x +200, obstacleClone.position.y + 100, obstacleClone.position.z);
            camera.lookAt(0,0,0);
          },
          onComplete: function() {
            console.log('Spawn '+spawned+' completed');
          }
        }, );   

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