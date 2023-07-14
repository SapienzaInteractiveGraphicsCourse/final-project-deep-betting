import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {dumpObject} from './utility.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as CANNON from 'cannon-es';
import gsap from 'gsap'
import  * as dat from "dat.gui"

class Obstacle {
    static{
        Obstacle.loaded = false;
        const gltfLoader = new GLTFLoader();
        //Load a glTF resource
        const obstacleAsset = new URL( '../assets/Crate.gltf', import.meta.url)
        gltfLoader.load(obstacleAsset.href, function(gltf){

            Obstacle.root = new THREE.Object3D;
            Obstacle.root.add(gltf.scene);
            Obstacle.clips = gltf.animations;

            // console.log(dumpObject(Obstacle.root).join('\n'));
            Obstacle.loaded = true;
            Obstacle.yBodyDisplacement = 1.4;
        })
    }

    constructor(scene, world, x, y, z, is_spawned){
        this.mesh = SkeletonUtils.clone(Obstacle.root);
        this.mesh.traverse(function(node){
            if(node.isMesh) node.castShadow = true;
        }.bind(this))

        this.mesh.position.set(x, y, z);
        this.mesh.scale.set(40,40,40);
        scene.add(this.mesh);

        //add physics
        const size = new CANNON.Vec3();
        const ostacoliPhysMat = new CANNON.ContactMaterial(new CANNON.Material(), new CANNON.Material(), { friction: 10.0, restitution: 0.0 });

        size.x = 1.6;
        size.y = 1.6;
        size.z = 1.6;

        const shape = new CANNON.Box(size);
        let BodyCANNON = new CANNON.Body({ 
            mass: 15, 
            shape: shape, 
            position: new CANNON.Vec3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z),
            material: ostacoliPhysMat,
            type: CANNON.Body.DYNAMIC
        })
        world.addBody(BodyCANNON);
        this.physicsBody = BodyCANNON;

        this.is_spawned = is_spawned != undefined && is_spawned == true ? true : false;
        if(this.is_spawned == true){
            console.log("Spawned obstacle with ID "+this.mesh.id+" at position X:"+this.mesh.position.x+" Y:"+this.mesh.position.y+" Z:"+this.mesh.position.z)
        }
    }

    applyForce(force,point){
        console.log("Apply force to obstacle: ",this.physicsBody.position)
        console.log(force)
        console.log(point)
        this.physicsBody.applyImpulse(force,point);
        // this.physicsBody.applyForce(force,point);
    }



    
}
export{Obstacle}