var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},s={},t=e.parcelRequire94c2;null==t&&((t=function(e){if(e in o)return o[e].exports;if(e in s){var t=s[e];delete s[e];var i={id:e,exports:{}};return o[e]=i,t.call(i.exports,i,i.exports),i.exports}var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,o){s[e]=o},e.parcelRequire94c2=t),t.register("jmFy0",(function(e,o){var s,i,n,r;s=e.exports,i="Obstacle",n=()=>h,Object.defineProperty(s,i,{get:n,set:r,enumerable:!0,configurable:!0});var l=t("ilwiq"),a=t("7lx9d");t("56DIn");var d=t("86dMk"),c=t("hrRcj");t("e93rA");class h{static#e=(()=>{h.loaded=!1;const e=new(0,a.GLTFLoader),o=new URL(t("hl9Nn"));e.load(o.href,(function(e){h.root=new l.Object3D,h.root.add(e.scene),h.clips=e.animations,h.loaded=!0,h.yBodyDisplacement=1.4}))})();constructor(e,o,s,t,i,n){this.mesh=d.clone(h.root),this.mesh.traverse(function(e){e.isMesh&&(e.castShadow=!0)}.bind(this)),this.mesh.position.set(s,t,i),this.mesh.scale.set(40,40,40),e.add(this.mesh);const r=new c.Vec3,l=new c.ContactMaterial(new c.Material,new c.Material,{friction:10,restitution:0});r.x=1.6,r.y=1.6,r.z=1.6;const a=new c.Box(r);let p=new c.Body({mass:15,shape:a,position:new c.Vec3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z),material:l,type:c.Body.DYNAMIC});o.addBody(p),this.physicsBody=p,this.is_spawned=null!=n&&1==n,1==this.is_spawned&&console.log("Spawned obstacle with ID "+this.mesh.id+" at position X:"+this.mesh.position.x+" Y:"+this.mesh.position.y+" Z:"+this.mesh.position.z)}applyForce(e,o){console.log("Apply force to obstacle: ",this.physicsBody.position),console.log(e),console.log(o),this.physicsBody.applyImpulse(e,o)}}})),t.register("hl9Nn",(function(e,o){e.exports=new URL(t("27Lyk").resolve("inGJz"),import.meta.url).toString()})),t("27Lyk").register(JSON.parse('{"iA8Lz":"index.ab658ea0.js","inGJz":"Crate.487aa5f3.gltf"}')),t("jmFy0");
//# sourceMappingURL=index.ab658ea0.js.map