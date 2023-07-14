import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {dumpObject} from './utility.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as CANNON from 'cannon-es';
import gsap from 'gsap'
import  * as dat from "dat.gui"


class Robot {
    static{
        Robot.loaded = false;
        const gltfLoader = new GLTFLoader();
        //Load a glTF resource
        const robotAsset = new URL( '../assets/Robot.glb', import.meta.url)
        gltfLoader.load(robotAsset.href, function(gltf){

            Robot.root = new THREE.Object3D;
            Robot.root.add(gltf.scene);
            Robot.clips = gltf.animations;

            // console.log(dumpObject(Robot.root).join('\n'));
            Robot.loaded = true;
        })
        Robot.robotAmount = 0;
        Robot.yBodyDisplacement = 2.7;
    }


    constructor(scene, world, x, y, z){
        this.mesh = SkeletonUtils.clone(Robot.root);
        this.bones = {};
        this.mesh.traverse(function(node){
            if(node.isMesh) node.castShadow = true;
        }.bind(this))

        this.setBones()

        this.mesh.position.set(x, y, z);
        this.mesh.scale.set(1.2,1.2,1.2)
        this.mesh.rotation.set(0,Math.PI/2,0)
        scene.add(this.mesh);

        //add the phisics
        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
        const size = new CANNON.Vec3();
        const robotPhysMat = new CANNON.ContactMaterial(new CANNON.Material(), new CANNON.Material(), { friction: 100.0, restitution: 0.0 });
    
        size.x = 3;
        size.y = 2.7;
        size.z = 2;
        const shape = new CANNON.Box(size);
        let robotBodyCANNON = new CANNON.Body({ 
            mass: 15, 
            shape: new CANNON.Box(shape.halfExtents), 
            position: new CANNON.Vec3(this.mesh.position.x,this.mesh.position.y-4,this.mesh.position.z),
            material: robotPhysMat ,
            type: CANNON.Body.KINEMATIC,
        })                
        world.addBody(robotBodyCANNON);
        this.physicsBody = robotBodyCANNON;


        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.speed = 0.5;
        this.runInitialAnimation();
        this.idleAnimation();


        this.is_running_animation = false;
        this.landed = true
        this.running_timescale = 1.0;
        this.init_for_running = true;
        this.is_my_robot = false;
    }

    setBones(){
        // Initialize the bones objec        
        // Set all bones
        this.bones.bone = this.mesh.getObjectByName("Bone");
        this.bones.footL = this.mesh.getObjectByName("FootL");
        this.bones.body = this.mesh.getObjectByName("Body");
        this.bones.hips = this.mesh.getObjectByName("Hips");
        this.bones.abdomen = this.mesh.getObjectByName("Abdomen");
        this.bones.torso = this.mesh.getObjectByName("Torso");
        this.bones.neck = this.mesh.getObjectByName("Neck");
        this.bones.head = this.mesh.getObjectByName("Head");
        this.bones.shoulderL = this.mesh.getObjectByName("ShoulderL");
        this.bones.upperArmL = this.mesh.getObjectByName("UpperArmL");
        this.bones.lowerArmL = this.mesh.getObjectByName("LowerArmL");
        this.bones.palm2L = this.mesh.getObjectByName("Palm2L");
        this.bones.middle1L = this.mesh.getObjectByName("Middle1L");
        this.bones.middle2L = this.mesh.getObjectByName("Middle2L");
        this.bones.thumbL = this.mesh.getObjectByName("ThumbL");
        this.bones.thumb2L = this.mesh.getObjectByName("Thumb2L");
        this.bones.palm1L = this.mesh.getObjectByName("Palm1L");
        this.bones.indexL = this.mesh.getObjectByName("IndexL");
        this.bones.index2L = this.mesh.getObjectByName("Index2L");
        this.bones.palm3L = this.mesh.getObjectByName("Palm3L");
        this.bones.ring1L = this.mesh.getObjectByName("Ring1L");
        this.bones.ring2L = this.mesh.getObjectByName("Ring2L");
        this.bones.shoulderR = this.mesh.getObjectByName("ShoulderR");
        this.bones.upperArmR = this.mesh.getObjectByName("UpperArmR");
        this.bones.lowerArmR = this.mesh.getObjectByName("LowerArmR");
        this.bones.palm2R = this.mesh.getObjectByName("Palm2R");
        this.bones.middle1R = this.mesh.getObjectByName("Middle1R");
        this.bones.middle2R = this.mesh.getObjectByName("Middle2R");
        this.bones.thumbR = this.mesh.getObjectByName("ThumbR");
        this.bones.thumb2R = this.mesh.getObjectByName("Thumb2R");
        this.bones.palm1R = this.mesh.getObjectByName("Palm1R");
        this.bones.indexR = this.mesh.getObjectByName("IndexR");
        this.bones.index2R = this.mesh.getObjectByName("Index2R");
        this.bones.palm3R = this.mesh.getObjectByName("Palm3R");
        this.bones.ring1R = this.mesh.getObjectByName("Ring1R");
        this.bones.ring2R = this.mesh.getObjectByName("Ring2R");
        this.bones.upperLegL = this.mesh.getObjectByName("UpperLegL");
        this.bones.lowerLegL = this.mesh.getObjectByName("LowerLegL");
        this.bones.upperLegR = this.mesh.getObjectByName("UpperLegR");
        this.bones.lowerLegR = this.mesh.getObjectByName("LowerLegR");
        this.bones.poleTargetL = this.mesh.getObjectByName("PoleTargetL");
        this.bones.footR = this.mesh.getObjectByName("FootR");
        this.bones.poleTargetR = this.mesh.getObjectByName("PoleTargetR");

        //iterate over all the bones and verify that they are not undefined or null or empty
        for (const key in this.bones) {
            if (this.bones.hasOwnProperty(key)) {
                const element = this.bones[key];
                if(element == undefined || element == null || element == ""){
                    console.error("bone "+key+" is not defined")
                }
            }
        }
    }

    runInitialAnimation() {
        // let randomClipInit = ['Robot_Dance','Robot_Idle','Robot_ThumbsUp','Robot_Wave'];
        // let randomClipElement = randomClipInit[Math.floor(Math.random() * randomClipInit.length)];
        // const initialClip = THREE.AnimationClip.findByName(Robot.clips,randomClipElement);
        // const initialAction = this.mixer.clipAction(initialClip);
        // initialAction.play();

        let random_animation = ["yes","wave","dance","hi"]
        let random_animation_element = random_animation[Math.floor(Math.random() * random_animation.length)];
        Robot.robotAmount += 1;
        switch (random_animation_element) {
            case "yes":
                console.log("yes animation: ",Robot.robotAmount)
                this.yesAnimation();
                break;
            case "wave":
                console.log("wave animation: ",Robot.robotAmount)
                this.waveAnimation();
                break;
            case "dance":
                console.log("dance animation: ",Robot.robotAmount)
                this.danceAnimation();
                break;
            case "thumbsup":
                console.log("thumbsup animation: ",Robot.robotAmount)
                this.thumbsUpAnimation();
                break;
            case "hi":
                console.log("hi animation: ",Robot.robotAmount)
                this.sayHiAnimation();
                break;
            default:
                break;
        }
    }

    yesAnimation(){
        if(!this.is_running_animation){
            new TWEEN.Tween(this.bones.neck.rotation)
            .to({ x: -Math.PI / 8 }, 150)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                new TWEEN.Tween(this.bones.neck.rotation)
                    .to({ x: Math.PI / 8 }, 150)
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(() => {
                        new TWEEN.Tween(this.bones.neck.rotation)
                            .to({ x: -Math.PI / 8 }, 150)
                            .easing(TWEEN.Easing.Linear.None)
                            .onComplete(() => {
                                new TWEEN.Tween(this.bones.neck.rotation)
                                    .to({ x: Math.PI / 8 }, 150)
                                    .easing(TWEEN.Easing.Linear.None)
                                    .onComplete(() => {
                                        new TWEEN.Tween(this.bones.neck.rotation)
                                            .to({ x: 0 }, 100)
                                            .easing(TWEEN.Easing.Quadratic.Out)
                                            .onComplete(() => {
                                                this.yesAnimation();
                                            })
                                            .start();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
            })
            .start();
        }
    }

    sayHiAnimation(){
        if(!this.is_running_animation){
            new TWEEN.Tween(this.bones.neck.rotation)
                .to({ z: 0.32 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.shoulderL.rotation)
                .to({ x: -1.7675, y: 0.1362, z: -1.7542 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.upperArmL.rotation)
                .to({ x: 0.712, y: -1.3084, z: 0.5608 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.lowerArmL.rotation)
                .to({ x: 1.3847, y: 0.8506, z: -1.4144 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {

                    new TWEEN.Tween(this.bones.lowerArmL.rotation)
                        .to({ z: -1.814 }, 150)
                        .easing(TWEEN.Easing.Linear.None)
                        .delay(50)
                        .onComplete(() => {

                            new TWEEN.Tween(this.bones.lowerArmL.rotation)
                                .to({ z: -1.4144 }, 150)
                                .easing(TWEEN.Easing.Linear.None)
                                .onComplete(() => {

                                    new TWEEN.Tween(this.bones.lowerArmL.rotation)
                                        .to({ z: -1.814 }, 100)
                                        .easing(TWEEN.Easing.Linear.None)
                                        .onComplete(() => {
                                            //Back to initial position
                                            new TWEEN.Tween(this.bones.neck.rotation)
                                                .to({ z: 0.05532293059308308 }, 150)
                                                .easing(TWEEN.Easing.Linear.None)
                                                .start();

                                            new TWEEN.Tween(this.bones.shoulderL.rotation)
                                                .to({ x: -0.10898229518839646, y: -0.000001107503889347332, z: -2.71796254738819 }, 150)
                                                .easing(TWEEN.Easing.Linear.None)
                                                .start();

                                            new TWEEN.Tween(this.bones.upperArmL.rotation)
                                                .to({ x: 0.3844815830256843, y: -1.5253074224154826, z: 0.5598306368119682 }, 150)
                                                .easing(TWEEN.Easing.Linear.None)
                                                .start();

                                            new TWEEN.Tween(this.bones.lowerArmL.rotation)
                                                .to({ x: 1.2070851479241527, y: 0.5176693038981423, z: -1.2969990028508354 }, 150)
                                                .easing(TWEEN.Easing.Linear.None)
                                                .onComplete(() => {
                                                    this.sayHiAnimation();
                                                })
                                                .start();
                                        })
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
            .start();
        }
    }

    thumbsUpAnimation(){
        if(!this.is_running_animation){
            let tween = new TWEEN.Tween(this.bones.upperArmR.rotation)
            .to({ x: (-120 * Math.PI) / 180, y: Math.PI / 4 }, 400)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                new TWEEN.Tween(this.bones.neck.rotation)
                    .to({ z: (-30 * Math.PI) / 180 }, 200)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(() => {

                        //Fingers except thumb closed to make the hand a fist
                        new TWEEN.Tween(this.bones.ring1R.rotation)
                            .to({ z: 0 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.middle1R.rotation)
                            .to({ z: (110 * Math.PI) / 180 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.indexR.rotation)
                            .to({ z: 0 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        //Thumb's parts rotated to make the thumb up
                        new TWEEN.Tween(this.bones.thumbR.rotation)
                            .to({ y: -Math.PI / 2 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.thumb2R.rotation)
                            .to({ x: -Math.PI, z: (-190 * Math.PI) / 180 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .onComplete(() => {
                                let t = this.thumbsDownTween();
                                t.delay(500);
                                t.start();
                            })
                            .start();

                    })
                    .start();
            });
        return tween;
        }
    }

    thumbsDownAnimation(){
    if(!this.is_running_animation){
            let tween = new TWEEN.Tween(this.bones.neck.rotation)
            .to({ z: 0.05532293059308308 }, 200)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {

                new TWEEN.Tween(this.bones.upperArmR.rotation)
                    .to({ x: -3.00467658726543, y: 1.2647589033354352 }, 400)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(() => {

                        new TWEEN.Tween(this.bones.ring1R.rotation)
                            .to({ z: -0.9430903747676498 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.middle1R.rotation)
                            .to({ z: 1.1048657896799357 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.indexR.rotation)
                            .to({ z: -0.9294445756102357 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.thumbR.rotation)
                            .to({ y: -0.9211440514236585 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();

                        new TWEEN.Tween(this.bones.thumb2R.rotation)
                            .to({ x: -1.717841085700298, z: -2.950171639213023 }, 150)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .onComplete(() => {
                                this.thumbsUpAnimation();
                            })
                            .start();

                    })
                    .start();
            });
            return tween;
        } 
    }

    danceAnimation(){
        if(!this.is_running_animation){
            new TWEEN.Tween(this.bones.body.rotation)
                .to({ x: 0.1561 }, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.upperLegL.rotation)
                .to({ x: 2.8087, y: -0.1433, z: -0.029 }, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.upperLegR.rotation)
                .to({ x: 2.8183, y: 0.1024, z: 0.0131 }, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.lowerLegL.rotation)
                .to({ x: 0.3428, y: 0.1535, z: 0.0352 }, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.lowerLegR.rotation)
                .to({ x: 0.3907, y: -0.0446, z: 3.4373933246063144e-7 }, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    new TWEEN.Tween(this.bones.neck.rotation) //Head spin
                        .to({ x: -0.1653, y: 0.1911, z: 0.2957 }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            new TWEEN.Tween(this.bones.shoulderR.rotation)
                                .to({ x: -0.10898371808911646, y: -6.598976085917453e-7, z: 1.5613, }, 200)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .start();

                            new TWEEN.Tween(this.bones.shoulderL.rotation)
                                .to({ x: -0.10898371808911646, y: -0.2156, z: -1.5331, }, 200)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .start();

                            new TWEEN.Tween(this.bones.lowerArmL.rotation)
                                .to({ x: 3.0617, z: -3.141592653589793 }, 200)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .onComplete(() => {
                                    new TWEEN.Tween(this.bones.lowerArmL.rotation)
                                        .to({ x: 1.5427, y: 0.1043, z: -3.013 }, 1000)
                                        .easing(TWEEN.Easing.Bounce.Out)
                                        .start();
                                })
                                .start();

                            new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                .to({ x: 3.141592653589793, y: -0.2156, z: 3.141592653589793, }, 200)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .onComplete(() => {
                                    new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                        .to({ x: 1.598, y: -0.4552 }, 1000)
                                        .easing(TWEEN.Easing.Bounce.Out)
                                        .onComplete(() => {
                                            new TWEEN.Tween(this.bones.neck.rotation)
                                                .to({ x: -0.1653, z: 0.05532293059308308, }, 1000)
                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                .onComplete(() => {
                                                    new TWEEN.Tween(this.bones.neck.rotation)
                                                        .to({ y: -2 * Math.PI }, 500)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .onComplete(() => {

                                                            //INITIAL POSITION
                                                            new TWEEN.Tween(this.bones.body.rotation)
                                                                .to({ x: 2.1138427250003886e-36, }, 800)
                                                                .easing(TWEEN.Easing.Linear.None)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.upperLegL.rotation)
                                                                .to({ x: 2.7479580378393664, y: -0.1554260117378598, z: -0.07532355032937453, }, 800)
                                                                .easing(TWEEN.Easing.Linear.None)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.upperLegR.rotation)
                                                                .to({ x: 2.7391203645467432, y: 0.2547631701687732, z: 0.11865935999323499, }, 800)
                                                                .easing(TWEEN.Easing.Linear.None)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.lowerLegL.rotation)
                                                                .to({ x: 0.7157526204231796, y: 1.630727074138696e-7, z: -2.2818463770589156e-7, }, 800)
                                                                .easing(TWEEN.Easing.Linear.None)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.lowerLegR.rotation)
                                                                .to({ x: 0.715752620423293, y: -4.961868483732194e-7, z: 3.4373933246063144e-7, }, 800)
                                                                .easing(TWEEN.Easing.Linear.None)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.neck.rotation)
                                                                .to({ x: -0.08598086606694484, z: 0.05532293059308308, }, 800)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                //Qui è il problema
                                                                .start();

                                                            new TWEEN.Tween(this.bones.shoulderR.rotation)
                                                                .to({ x: -0.10898371808911646, y: -6.598976085917453e-7, z: 2.686421566968824, }, 800)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.shoulderL.rotation)
                                                                .to({ x: -0.10898229518839646, y: -0.000001107503889347332, z: -2.71796254738819, }, 800)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.lowerArmL.rotation)
                                                                .to({ x: 1.2070851479241527, y: 0.5176693038981423, z: -1.2969990028508354, }, 800)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                .start();

                                                            new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                                                .to({ x: 1.5924057846474595, y: -1.0731507461813292, z: 1.8341744463831946, }, 800)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                .onComplete(() => {
                                                                    this.danceAnimation();
                                                                })
                                                                .start();
                                                        })
                                                        .start();
                                                })
                                                .start();
                                        })
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();
        }
    }

    waveAnimation(){
        if(!this.is_running_animation){
            new TWEEN.Tween(this.bones.shoulderR.rotation)
            .to({ z: 1.5635 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

            new TWEEN.Tween(this.bones.upperArmR.rotation)
                .to({ y: -0.5352, z: -3.141592653589793 }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {



                    new TWEEN.Tween(this.bones.lowerArmR.rotation)
                        .to({ y: -1.0954 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.neck.rotation)
                        .to({ z: -0.2154 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.ring1R.rotation)
                        .to({ x: 2.0308031237629196, y: 0.9080663435840112, z: -2.3735, }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.ring2R.rotation)
                        .to({ x: -0.1219, y: -0.0766, z: 0.0899 }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.middle1R.rotation)
                        .to({ x: -0.06356590149694044, y: -0.06346705740446676, z: -0.0904, }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.middle2R.rotation)
                        .to({ x: 0.09968116913559923, y: -0.03203014545859623, z: 0.2639, }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.indexR.rotation)
                        .to({ x: -1.9068990040299865, y: -1.1349, z: -2.0538, }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.index2R.rotation)
                        .to({ x: -0.05851721796114638, y: -0.06463397545402096, z: 0.0451, }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.thumbR.rotation)
                        .to({ x: 2.8878214068890493, y: -1.7593, z: 1.5259, }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.thumb2R.rotation)
                        .to({ x: -2.8186, y: -0.8862, z: -2.9733 }, 100)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();

                    new TWEEN.Tween(this.bones.lowerArmR.rotation)
                        .to({ y: -0.4556 }, 150)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {

                            new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                .to({ y: -1.0962 }, 150)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .onComplete(() => {

                                    new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                        .to({ y: -0.4556 }, 150)
                                        .easing(TWEEN.Easing.Quadratic.Out)
                                        .onComplete(() => {

                                            new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                                .to({ y: -1.0962 }, 150)
                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                .onComplete(() => {

                                                    new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                                        .to({ y: -0.4556 }, 150)
                                                        .easing(TWEEN.Easing.Quadratic.Out)
                                                        .onComplete(() => {

                                                            new TWEEN.Tween(this.bones.lowerArmR.rotation)
                                                                .to({ y: -1.0962, }, 150)
                                                                .easing(TWEEN.Easing.Quadratic.Out)
                                                                .onComplete(
                                                                    () => {
                                                                        this.waveFinishAnimation();
                                                                    }
                                                                )
                                                                .start();
                                                        })
                                                        .start();
                                                })
                                                .start();
                                        })
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
            .start();
        }
    }
    
    waveFinishAnimation(){
        if(!this.is_running_animation){
            new TWEEN.Tween(this.bones.shoulderR.rotation)
            .to({ x: -0.10898371808911646, y: -6.598976085917453e-7, z: 2.686421566968824, }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

            new TWEEN.Tween(this.bones.upperArmR.rotation)
                .to({ x: -3.00467658726543, y: 1.2647589033354352, z: -3.133786251177098, }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.lowerArmR.rotation)
                .to({ x: 1.5924057846474595, y: -1.0731507461813292, z: 1.8341744463831946, }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.neck.rotation)
                .to(
                    { x: -0.08598086606694484, y: -0.030781048113647718, z: 0.05532293059308308, }, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.ring1R.rotation)
                .to({ x: 2.0308031237629196, y: 0.9080663435840112, z: -0.9430903747676498, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.ring2R.rotation)
                .to({ x: 0.2314505243580185, y: 0.16359926060669314, z: 0.8729432557646827, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.middle1R.rotation)
                .to({ x: -0.06356590149694044, y: -0.06346705740446676, z: 1.1048657896799357, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.middle2R.rotation)
                .to({ x: 0.09968116913559923, y: -0.03203014545859623, z: 1.061314611564705, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.indexR.rotation)
                .to({ x: -1.9068990040299865, y: -1.0366460832544102, z: -0.9294445756102357, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.index2R.rotation)
                .to({ x: -0.05851721796114638, y: -0.06463397545402096, z: 1.109980777526842, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.thumbR.rotation)
                .to({ x: 2.8878214068890493, y: -0.9211440514236585, z: 1.3133193709709825, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(this.bones.thumb2R.rotation)
                .to({ x: -1.717841085700298, y: -0.639071107342826, z: -2.950171639213023, }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    this.waveAnimation()
                })
                .start();
        }
    }


    punchAnimation(targetBody,obstacleArray,scene,world){
        if(!this.is_running_animation){
            this.is_running_animation = true;
            this.mixer.stopAllAction();
            this.backup_speed = this.speed;
            this.speed = 0.0;
            this.normalPosition();

            new TWEEN.Tween(this.bones.neck.rotation)
                .to({ z: 0.32 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.shoulderL.rotation)
                .to({ x: -1.3475, y: 0.1362, z: -1.06 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(this.bones.upperArmL.rotation)
                .to({ x: 0.712, y: -1.3084, z: 0.5608 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        

            new TWEEN.Tween(this.bones.lowerArmL.rotation)
                .to({ x: 0.3847, y: 0.8506, z: -2.3244 }, 150)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    //insert Finger here
                    new TWEEN.Tween(this.bones.hips.rotation)
                    .to({x:0 , y: -0.58, z: 0 }, 150)
                    .easing(TWEEN.Easing.Linear.None)
                    .start();


                    new TWEEN.Tween(this.bones.shoulderL.rotation)
                    .to({ x: -1.62, y: -0.1662, z: -2.6 }, 150)
                    .easing(TWEEN.Easing.Linear.None)
                    .start();

                    new TWEEN.Tween(this.bones.lowerArmL.rotation)
                    .to({ x: 0.74, y: 1.35, z: -1.13 }, 150)
                    .easing(TWEEN.Easing.Linear.None)
                    .start()
                    .onComplete(() => {
                        //back to normal
                        this.is_running_animation = false;
                        if(this.is_my_robot == false){
                            let index = obstacleArray.findIndex(x => x.physicsBody.id === targetBody.id);
                            if(index != -1){
                                const force = new CANNON.Vec3(0, 15, 2);         
                                const point = new CANNON.Vec3(obstacleArray[index].physicsBody.position.x, obstacleArray[index].physicsBody.position.y, obstacleArray[index].physicsBody.position.z);
                                obstacleArray[index].applyForce(force, point);
                            }
                        }else{
                            //find the most colsest obstacle (Between the random spawned ones)
                            for(let j = 0; j < obstacleArray.length; j++){
                                // console.log("Distance: :", Math.abs(this.mesh.position.x - ostacoliBody[j].position.x))
                                if(Math.abs(this.mesh.position.x - obstacleArray[j].physicsBody.position.x) < 10){
                                    console.log("Obstacle ",j," is close to the robot")
                                    let index = obstacleArray.findIndex(x => x.mesh.id === obstacleArray[j].mesh.id);
                                    if(index != -1){
                                        const force = new CANNON.Vec3(0, 120, 30); 
                                        const point = new CANNON.Vec3(obstacleArray[index].physicsBody.position.x, obstacleArray[index].physicsBody.position.y, obstacleArray[index].physicsBody.position.z); 
                                        obstacleArray[index].applyForce(force, point);                                       
                                    }   
                                }
                            }
                        }

                        this.normalPosition();
                        setTimeout(() => {
                            let runningClip = THREE.AnimationClip.findByName( Robot.clips , 'Robot_Running' );
                            let runningAction = this.mixer.clipAction( runningClip ); 
                            runningAction.reset()   
                            runningAction.play();
                            
                            this.speed = this.initial_speed
                            this.is_running_animation = false;
                        },300)
                    });
                
                })
            .start();
        }
        



    }

    normalPosition(){

        new TWEEN.Tween(this.bones.hips.rotation)
        .to({x: -0.32 , y: 0, z: 0 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start();
        
        new TWEEN.Tween(this.bones.neck.rotation)
        .to({ x: 0, y: 0, z: 0.0 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start();

        new TWEEN.Tween(this.bones.head.rotation)
        .to({ x: 0, y: 0, z: 0.0 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start();

        new TWEEN.Tween(this.bones.shoulderL.rotation)
        .to({ x: 0.25, y: 0.18, z: -2.59 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start()

    
        new TWEEN.Tween(this.bones.shoulderR.rotation)
        .to({ x: -1.25, y: 0.18, z: 2.59 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start()


        new TWEEN.Tween(this.bones.lowerArmR.rotation)
        .to({ x: 0.95, y: -2.38, z: 1.159  }, 150)
        // .to({ x: -0.58, y: 2.69, z: 0.95  }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .start()

    }


    idleAnimation(){
        this.mixer
        let shoulderLTimeline = gsap.timeline();
        let shoulderRTimeline = gsap.timeline();
        let headTimeline = gsap.timeline();

       
        shoulderLTimeline.to(this.bones.shoulderL.rotation, {
            x: 1.57,
            y: -1,
            duration: 0.3,
            ease: "expo.out",
        })

        shoulderRTimeline.to(this.bones.shoulderR.rotation, {
            x: 1.57,
            y: 1,
            duration: 0.3,
            ease: "expo.out",
        });
    }


    jumpAnimation(){

        if(!this.is_running_animation){
            this.is_running_animation = true;
            this.mixer.stopAllAction();


            let rotationUpperLegL = {} 
            rotationUpperLegL.x =  this.bones.upperLegL.rotation.x
            rotationUpperLegL.y =  this.bones.upperLegL.rotation.y
            rotationUpperLegL.z =  this.bones.upperLegL.rotation.z

            let rotationLowerLegL = {}
            rotationLowerLegL.x = this.bones.lowerLegL.rotation.x
            rotationLowerLegL.y = this.bones.lowerLegL.rotation.y
            rotationLowerLegL.z = this.bones.lowerLegL.rotation.z
            
            new TWEEN.Tween(this.bones.upperLegL.rotation)
            .to({x: 2.18}, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

            
            new TWEEN.Tween(this.bones.lowerLegL.rotation)
            .to({x: 1.57}, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

            
            new TWEEN.Tween(this.bones.upperLegR.rotation)
            .to({x: 2.18}, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
            
            new TWEEN.Tween(this.bones.lowerLegR.rotation)
            .to({x: 1.57}, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

            this.speed = 0

            new TWEEN.Tween(this.bones.bone.position)
            .to({y: this.bones.bone.position.y - 0.3}, 400)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
            .onComplete(() => {
                //back the leg to the original position
                new TWEEN.Tween(this.bones.upperLegL.rotation)
                .to({x: rotationUpperLegL.x}, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

                new TWEEN.Tween(this.bones.lowerLegL.rotation)
                .to({x: rotationLowerLegL.x}, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()

                new TWEEN.Tween(this.bones.upperLegR.rotation)
                .to({x: rotationUpperLegL.x}, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

                new TWEEN.Tween(this.bones.lowerLegR.rotation)
                .to({x: rotationLowerLegL.x}, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            
                // Set the radius of the semicircle
                const radius = 8;

                // Set the duration of the animation
                const duration = 600;

                // Start the animation
                new TWEEN.Tween({ angle: 0 })
                .to({ angle: Math.PI }, duration)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(({ angle }) => {
                    const y = radius * Math.sin(angle);
                    this.mesh.position.setY(y);
                })
                .start()
                
                new TWEEN.Tween(this.bones.bone.position)
                .to({y: this.bones.bone.position.y - 0.3}, 400)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()

                

                new TWEEN.Tween(this.mesh.position)
                .to({x: this.mesh.position.x + 9}, duration)
                .easing(TWEEN.Easing.Linear.None)
                .start()
                .onComplete(() => {
                    this.is_running_animation = false;

                    setTimeout(() => {
                        let runningClip = THREE.AnimationClip.findByName( Robot.clips , 'Robot_Running' );
                        let runningAction = this.mixer.clipAction( runningClip ); 
                        runningAction.reset()   
                        runningAction.play();
                        
                        this.speed = this.initial_speed
                        this.is_running_animation = false;
                    },101)
                });
            
                

            });

        }  


    }

 
    // ---------- CLIPS
    runningClip(){
        this.mixer.stopAllAction();
        let runningClip = THREE.AnimationClip.findByName( Robot.clips , 'Robot_Running' );
        let runningAction = this.mixer.clipAction( runningClip );
        runningAction.timeScale = (1/(1-this.speed))-0.2;
        runningAction.play();
    }

    updateMixer(deltaTime){
        this.mixer.update(deltaTime);
    }

    // ---------- Physics
    linkMeshAndBody(){
        this.physicsBody.position.copy(this.mesh.position);
        this.physicsBody.position.y = this.physicsBody.position.y + Robot.yBodyDisplacement;
        this.physicsBody.quaternion.copy(this.mesh.quaternion);
    }
    
    // ---------- HELPERS
    showBonesGuide(){
        const gui = new dat.GUI();
        for (const boneName in this.bones) {
            const bone = this.bones[boneName];
            if(bone){
                // Add rotation controls for the bone on the x, y, and z axes
                gui.add(bone.rotation, 'x', -Math.PI, Math.PI).name(boneName+" x").onChange((e) => {
                  bone.rotation.x = e;
                  console.log(boneName+"-> x rotation : "+bone.rotation.x)
                });
                
                gui.add(bone.rotation,'y', -Math.PI, Math.PI).name(boneName+" y").onChange((e) => {
                  bone.rotation.y = e;
                  console.log(boneName+"-> y rotation : "+bone.rotation.y)
                });
                
                gui.add(bone.rotation, 'z', -Math.PI, Math.PI).name(boneName+" z").onChange((e) => {
                  bone.rotation.z = e;
                  console.log(boneName+"-> z rotation : "+bone.rotation.z)
                });
            }
          }
    }

    showButtonsForActions(){
        //create a button and append it in the body
        const punchButton = document.createElement("button");        
        punchButton.innerHTML = "Punch";
        punchButton.classList.add("actionButton");
        document.body.appendChild(punchButton);
        //add an event listener to the button
        punchButton.addEventListener("click", () => {
            this.punchAnimation(null,obstacleArray,scene,world);
        });

        //create a button for jump
        const jumpButton = document.createElement("button");
        jumpButton.innerHTML = "Jump";
        jumpButton.classList.add("actionButton");
        document.body.appendChild(jumpButton);
        //add an event listener to the button
        jumpButton.addEventListener("click", () => {
            this.jumpAnimation();
        }
        );
    }

   

}
    


export {Robot} 
