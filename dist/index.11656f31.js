function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},i=t.parcelRequire94c2;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var i={id:e,exports:{}};return n[e]=i,t.call(i.exports,i,i.exports),i.exports}var s=new Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){o[e]=t},t.parcelRequire94c2=i),i("27Lyk").register(JSON.parse('{"cuNwk":"index.11656f31.js","9yJXr":"Houses_SecondAge_1_Level1.7a164457.gltf","dR1Lm":"Wall_FirstAge.c65ea624.gltf","2vJvh":"Farm_FirstAge_Level3_Wheat.dd43dca0.gltf","dLzQ7":"sky_bg.44e58a56.png","gUhD5":"land_bg.1527eb73.png","7xpNR":"groundtexture.8eb6419d.png","bwIYN":"shift.c0eab982.png","2SsoL":"space.d223be8b.png","kKAi4":"countdown.1607c6b7.mp3","eVHoR":"start.68ac195b.mp3","cQt7V":"pop.4970970e.mp3","lr77t":"trash.d1a40a99.mp3","hhGbj":"eyeofthetiger.923b03c3.mp3"}'));var s=i("ilwiq");s=i("ilwiq");const a={type:"change"},r={type:"start"},c={type:"end"};class l extends s.EventDispatcher{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new(0,s.Vector3),this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:s.MOUSE.ROTATE,MIDDLE:s.MOUSE.DOLLY,RIGHT:s.MOUSE.PAN},this.touches={ONE:s.TOUCH.ROTATE,TWO:s.TOUCH.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return d.phi},this.getAzimuthalAngle=function(){return d.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(e){e.addEventListener("keydown",K),this._domElementKeyEvents=e},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",K),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(a),n.update(),i=o.NONE},this.update=function(){const t=new(0,s.Vector3),r=(new(0,s.Quaternion)).setFromUnitVectors(e.up,new(0,s.Vector3)(0,1,0)),c=r.clone().invert(),y=new(0,s.Vector3),g=new(0,s.Quaternion),f=2*Math.PI;return function(){const e=n.object.position;t.copy(e).sub(n.target),t.applyQuaternion(r),d.setFromVector3(t),n.autoRotate&&i===o.NONE&&O(2*Math.PI/60/60*n.autoRotateSpeed),n.enableDamping?(d.theta+=u.theta*n.dampingFactor,d.phi+=u.phi*n.dampingFactor):(d.theta+=u.theta,d.phi+=u.phi);let s=n.minAzimuthAngle,b=n.maxAzimuthAngle;return isFinite(s)&&isFinite(b)&&(s<-Math.PI?s+=f:s>Math.PI&&(s-=f),b<-Math.PI?b+=f:b>Math.PI&&(b-=f),d.theta=s<=b?Math.max(s,Math.min(b,d.theta)):d.theta>(s+b)/2?Math.max(s,d.theta):Math.min(b,d.theta)),d.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,d.phi)),d.makeSafe(),d.radius*=m,d.radius=Math.max(n.minDistance,Math.min(n.maxDistance,d.radius)),!0===n.enableDamping?n.target.addScaledVector(p,n.dampingFactor):n.target.add(p),t.setFromSpherical(d),t.applyQuaternion(c),e.copy(n.target).add(t),n.object.lookAt(n.target),!0===n.enableDamping?(u.theta*=1-n.dampingFactor,u.phi*=1-n.dampingFactor,p.multiplyScalar(1-n.dampingFactor)):(u.set(0,0,0),p.set(0,0,0)),m=1,!!(h||y.distanceToSquared(n.object.position)>l||8*(1-g.dot(n.object.quaternion))>l)&&(n.dispatchEvent(a),y.copy(n.object.position),g.copy(n.object.quaternion),h=!1,!0)}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",G),n.domElement.removeEventListener("pointerdown",U),n.domElement.removeEventListener("pointercancel",B),n.domElement.removeEventListener("wheel",X),n.domElement.removeEventListener("pointermove",Y),n.domElement.removeEventListener("pointerup",V),null!==n._domElementKeyEvents&&(n._domElementKeyEvents.removeEventListener("keydown",K),n._domElementKeyEvents=null)};const n=this,o={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let i=o.NONE;const l=1e-6,d=new(0,s.Spherical),u=new(0,s.Spherical);let m=1;const p=new(0,s.Vector3);let h=!1;const y=new(0,s.Vector2),g=new(0,s.Vector2),f=new(0,s.Vector2),b=new(0,s.Vector2),w=new(0,s.Vector2),v=new(0,s.Vector2),S=new(0,s.Vector2),E=new(0,s.Vector2),L=new(0,s.Vector2),x=[],A={};function _(){return Math.pow(.95,n.zoomSpeed)}function O(e){u.theta-=e}function C(e){u.phi-=e}const M=function(){const e=new(0,s.Vector3);return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),p.add(e)}}(),T=function(){const e=new(0,s.Vector3);return function(t,o){!0===n.screenSpacePanning?e.setFromMatrixColumn(o,1):(e.setFromMatrixColumn(o,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),p.add(e)}}(),k=function(){const e=new(0,s.Vector3);return function(t,o){const i=n.domElement;if(n.object.isPerspectiveCamera){const s=n.object.position;e.copy(s).sub(n.target);let a=e.length();a*=Math.tan(n.object.fov/2*Math.PI/180),M(2*t*a/i.clientHeight,n.object.matrix),T(2*o*a/i.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(M(t*(n.object.right-n.object.left)/n.object.zoom/i.clientWidth,n.object.matrix),T(o*(n.object.top-n.object.bottom)/n.object.zoom/i.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function H(e){n.object.isPerspectiveCamera?m/=e:n.object.isOrthographicCamera?(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom*e)),n.object.updateProjectionMatrix(),h=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function R(e){n.object.isPerspectiveCamera?m*=e:n.object.isOrthographicCamera?(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/e)),n.object.updateProjectionMatrix(),h=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function P(e){y.set(e.clientX,e.clientY)}function q(e){b.set(e.clientX,e.clientY)}function F(){if(1===x.length)y.set(x[0].pageX,x[0].pageY);else{const e=.5*(x[0].pageX+x[1].pageX),t=.5*(x[0].pageY+x[1].pageY);y.set(e,t)}}function z(){if(1===x.length)b.set(x[0].pageX,x[0].pageY);else{const e=.5*(x[0].pageX+x[1].pageX),t=.5*(x[0].pageY+x[1].pageY);b.set(e,t)}}function N(){const e=x[0].pageX-x[1].pageX,t=x[0].pageY-x[1].pageY,n=Math.sqrt(e*e+t*t);S.set(0,n)}function I(e){if(1==x.length)g.set(e.pageX,e.pageY);else{const t=Q(e),n=.5*(e.pageX+t.x),o=.5*(e.pageY+t.y);g.set(n,o)}f.subVectors(g,y).multiplyScalar(n.rotateSpeed);const t=n.domElement;O(2*Math.PI*f.x/t.clientHeight),C(2*Math.PI*f.y/t.clientHeight),y.copy(g)}function j(e){if(1===x.length)w.set(e.pageX,e.pageY);else{const t=Q(e),n=.5*(e.pageX+t.x),o=.5*(e.pageY+t.y);w.set(n,o)}v.subVectors(w,b).multiplyScalar(n.panSpeed),k(v.x,v.y),b.copy(w)}function D(e){const t=Q(e),o=e.pageX-t.x,i=e.pageY-t.y,s=Math.sqrt(o*o+i*i);E.set(0,s),L.set(0,Math.pow(E.y/S.y,n.zoomSpeed)),H(L.y),S.copy(E)}function U(e){!1!==n.enabled&&(0===x.length&&(n.domElement.setPointerCapture(e.pointerId),n.domElement.addEventListener("pointermove",Y),n.domElement.addEventListener("pointerup",V)),function(e){x.push(e)}(e),"touch"===e.pointerType?function(e){switch(W(e),x.length){case 1:switch(n.touches.ONE){case s.TOUCH.ROTATE:if(!1===n.enableRotate)return;F(),i=o.TOUCH_ROTATE;break;case s.TOUCH.PAN:if(!1===n.enablePan)return;z(),i=o.TOUCH_PAN;break;default:i=o.NONE}break;case 2:switch(n.touches.TWO){case s.TOUCH.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&N(),n.enablePan&&z(),i=o.TOUCH_DOLLY_PAN;break;case s.TOUCH.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&N(),n.enableRotate&&F(),i=o.TOUCH_DOLLY_ROTATE;break;default:i=o.NONE}break;default:i=o.NONE}i!==o.NONE&&n.dispatchEvent(r)}(e):function(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case s.MOUSE.DOLLY:if(!1===n.enableZoom)return;!function(e){S.set(e.clientX,e.clientY)}(e),i=o.DOLLY;break;case s.MOUSE.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enablePan)return;q(e),i=o.PAN}else{if(!1===n.enableRotate)return;P(e),i=o.ROTATE}break;case s.MOUSE.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enableRotate)return;P(e),i=o.ROTATE}else{if(!1===n.enablePan)return;q(e),i=o.PAN}break;default:i=o.NONE}i!==o.NONE&&n.dispatchEvent(r)}(e))}function Y(e){!1!==n.enabled&&("touch"===e.pointerType?function(e){switch(W(e),i){case o.TOUCH_ROTATE:if(!1===n.enableRotate)return;I(e),n.update();break;case o.TOUCH_PAN:if(!1===n.enablePan)return;j(e),n.update();break;case o.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;!function(e){n.enableZoom&&D(e),n.enablePan&&j(e)}(e),n.update();break;case o.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;!function(e){n.enableZoom&&D(e),n.enableRotate&&I(e)}(e),n.update();break;default:i=o.NONE}}(e):function(e){switch(i){case o.ROTATE:if(!1===n.enableRotate)return;!function(e){g.set(e.clientX,e.clientY),f.subVectors(g,y).multiplyScalar(n.rotateSpeed);const t=n.domElement;O(2*Math.PI*f.x/t.clientHeight),C(2*Math.PI*f.y/t.clientHeight),y.copy(g),n.update()}(e);break;case o.DOLLY:if(!1===n.enableZoom)return;!function(e){E.set(e.clientX,e.clientY),L.subVectors(E,S),L.y>0?H(_()):L.y<0&&R(_()),S.copy(E),n.update()}(e);break;case o.PAN:if(!1===n.enablePan)return;!function(e){w.set(e.clientX,e.clientY),v.subVectors(w,b).multiplyScalar(n.panSpeed),k(v.x,v.y),b.copy(w),n.update()}(e)}}(e))}function V(e){Z(e),0===x.length&&(n.domElement.releasePointerCapture(e.pointerId),n.domElement.removeEventListener("pointermove",Y),n.domElement.removeEventListener("pointerup",V)),n.dispatchEvent(c),i=o.NONE}function B(e){Z(e)}function X(e){!1!==n.enabled&&!1!==n.enableZoom&&i===o.NONE&&(e.preventDefault(),n.dispatchEvent(r),function(e){e.deltaY<0?R(_()):e.deltaY>0&&H(_()),n.update()}(e),n.dispatchEvent(c))}function K(e){!1!==n.enabled&&!1!==n.enablePan&&function(e){let t=!1;switch(e.code){case n.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?C(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?C(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?O(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?O(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}(e)}function G(e){!1!==n.enabled&&e.preventDefault()}function Z(e){delete A[e.pointerId];for(let t=0;t<x.length;t++)if(x[t].pointerId==e.pointerId)return void x.splice(t,1)}function W(e){let t=A[e.pointerId];void 0===t&&(t=new(0,s.Vector2),A[e.pointerId]=t),t.set(e.pageX,e.pageY)}function Q(e){const t=e.pointerId===x[0].pointerId?x[1]:x[0];return A[t.pointerId]}n.domElement.addEventListener("contextmenu",G),n.domElement.addEventListener("pointerdown",U),n.domElement.addEventListener("pointercancel",B),n.domElement.addEventListener("wheel",X,{passive:!1}),this.update()}}var d=i("7lx9d");i("e93rA");var u=i("4AGbv"),m=i("hrRcj");m=i("hrRcj"),s=i("ilwiq");i("56DIn");var p,h=i("QfFta"),y=i("jmFy0");p=new URL(i("27Lyk").resolve("dLzQ7"),import.meta.url).toString();var g;g=new URL(i("27Lyk").resolve("gUhD5"),import.meta.url).toString();var f;f=new URL(i("27Lyk").resolve("7xpNR"),import.meta.url).toString();new URL(i("27Lyk").resolve("bwIYN"),import.meta.url).toString();new URL(i("27Lyk").resolve("2SsoL"),import.meta.url).toString();var b=[];const w=1/60,v=new m.World({gravity:new m.Vec3(0,-100,0)});let S=40;const E={spawnAmount:3};var L;L=new URL(i("27Lyk").resolve("9yJXr"),import.meta.url).toString();const x=new URL(L);var A;A=new URL(i("27Lyk").resolve("dR1Lm"),import.meta.url).toString();const _=new URL(A);var O;O=new URL(i("27Lyk").resolve("2vJvh"),import.meta.url).toString();const C=new URL(O),M=new s.Scene,T=new s.LoadingManager,k=new(0,d.GLTFLoader)(T),H=document.querySelector("#progress-bar");T.onProgress=function(e,t,n){H.value=t/n*100};const R=document.querySelector(".progress-bar-container");T.onLoad=function(){R.style.display="none"};const P=new s.CubeTextureLoader(T);M.background=P.load([e(p),e(p),e(p),e(g),e(p),e(p)]);let q=[],F=[];var z=[];const N=u.default.timeline();let I=0;var j,D=!1,U=!1,Y=2,V=.3,B=0,X=0;j=new URL(i("27Lyk").resolve("kKAi4"),import.meta.url).toString();var K;K=new URL(i("27Lyk").resolve("eVHoR"),import.meta.url).toString();var G;G=new URL(i("27Lyk").resolve("cQt7V"),import.meta.url).toString();var Z;Z=new URL(i("27Lyk").resolve("lr77t"),import.meta.url).toString();var W;W=new URL(i("27Lyk").resolve("hhGbj"),import.meta.url).toString();var Q=new Audio(j),J=new Audio(K),$=new Audio(G),ee=new Audio(Z),te=new Audio(W),ne=[!1,!1,!1,!1];const oe=new s.Clock;var ie,se=!1,ae=!1,re=!1,ce=null;const le=new s.WebGLRenderer({antialias:!0});le.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(le.domElement),le.setClearColor(0),le.shadowMap.enabled=!0;const de=new s.PerspectiveCamera(20,window.innerWidth/window.innerHeight,.1,1e3),ue=new l(de,le.domElement);ue.update();const me=(new s.TextureLoader).load(e(f)),pe=new s.Mesh(new s.PlaneGeometry(300,100),new s.MeshStandardMaterial({side:s.DoubleSide,map:me,bumpMap:me,bumpScale:5,visible:!0}));pe.rotateX(-Math.PI/2),M.add(pe),pe.receiveShadow=!0;const he=new m.Material({friction:100}),ye=new m.Body({shape:new m.Box(new m.Vec3(150,.1,50)),position:new m.Vec3(0,-.1,0),material:he});v.addBody(ye);const ge=new s.AmbientLight(16711422,.4);M.add(ge);const fe=new s.DirectionalLight(16710875,.8);M.add(fe),fe.position.set(-20,50,0),fe.castShadow=!0,fe.shadow.camera.bottom=-50,fe.shadow.camera.top=50,fe.shadow.camera.left=-100,fe.shadow.camera.right=100;var be={directionalLight:{x:0,y:50,z:0,rot_x:0,rot_y:0,rot_z:0},camera:{rot_x:de.rotation.x,rot_y:de.rotation.y,rot_z:de.rotation.z},gameConstants:{num_robots:5,indexCameraFollows:Y,camera_view:"third_person",spawnAnimationCameraDuration:10,buttonsInstructionsFadeDuration:15},settings:{sound_enabled:!0,physic_debug:!1},robotAnimationsActive:{0:"running",1:"running",2:"running",3:"running",4:"running"}},we={space:!1,shift:!1};const ve=new function(e,t,n){let{color:o=65280,scale:i=1,onInit:a,onUpdate:r}=void 0===n?{}:n;const c=[],l=new(0,s.MeshBasicMaterial)({color:null!=o?o:65280,wireframe:!0}),d=new(0,m.Vec3),u=new(0,m.Vec3),p=new(0,m.Vec3),h=new(0,m.Quaternion),y=new(0,s.SphereGeometry)(1),g=new(0,s.BoxGeometry)(1,1,1),f=new(0,s.PlaneGeometry)(10,10,10,10);function b(t){let n=new(0,s.Mesh);const{SPHERE:o,BOX:i,PLANE:a,CYLINDER:r,CONVEXPOLYHEDRON:c,TRIMESH:h,HEIGHTFIELD:b}=m.Shape.types;switch(t.type){case o:n=new(0,s.Mesh)(y,l);break;case i:n=new(0,s.Mesh)(g,l);break;case a:n=new(0,s.Mesh)(f,l);break;case r:{const e=new(0,s.CylinderGeometry)(t.radiusTop,t.radiusBottom,t.height,t.numSegments);n=new(0,s.Mesh)(e,l),t.geometryId=e.id;break}case c:{const e=function(e){const t=new(0,s.BufferGeometry),n=[];for(let t=0;t<e.vertices.length;t++){const o=e.vertices[t];n.push(o.x,o.y,o.z)}t.setAttribute("position",new(0,s.Float32BufferAttribute)(n,3));const o=[];for(let t=0;t<e.faces.length;t++){const n=e.faces[t],i=n[0];for(let e=1;e<n.length-1;e++){const t=n[e],s=n[e+1];o.push(i,t,s)}}return t.setIndex(o),t.computeBoundingSphere(),t.computeVertexNormals(),t}(t);n=new(0,s.Mesh)(e,l),t.geometryId=e.id;break}case h:{const e=function(e){const t=new(0,s.BufferGeometry),n=[],o=d,i=u,a=p;for(let t=0;t<e.indices.length/3;t++)e.getTriangleVertices(t,o,i,a),n.push(o.x,o.y,o.z),n.push(i.x,i.y,i.z),n.push(a.x,a.y,a.z);return t.setAttribute("position",new(0,s.Float32BufferAttribute)(n,3)),t.computeBoundingSphere(),t.computeVertexNormals(),t}(t);n=new(0,s.Mesh)(e,l),t.geometryId=e.id;break}case b:{const e=function(e){const t=new(0,s.BufferGeometry),n=e.elementSize||1,o=e.data.flatMap(((e,t)=>e.flatMap(((e,o)=>[t*n,o*n,e])))),i=[];for(let t=0;t<e.data.length-1;t++)for(let n=0;n<e.data[t].length-1;n++){const o=e.data[t].length,s=t*o+n;i.push(s+1,s+o,s+o+1),i.push(s+o,s+1,s)}return t.setIndex(i),t.setAttribute("position",new(0,s.Float32BufferAttribute)(o,3)),t.computeBoundingSphere(),t.computeVertexNormals(),t}(t);n=new(0,s.Mesh)(e,l),t.geometryId=e.id;break}}return e.add(n),n}function w(t,n){let o=c[t],a=!1;return function(e,t){if(!e)return!1;const{geometry:n}=e;return n instanceof s.SphereGeometry&&t.type===m.Shape.types.SPHERE||n instanceof s.BoxGeometry&&t.type===m.Shape.types.BOX||n instanceof s.PlaneGeometry&&t.type===m.Shape.types.PLANE||n.id===t.geometryId&&t.type===m.Shape.types.CYLINDER||n.id===t.geometryId&&t.type===m.Shape.types.CONVEXPOLYHEDRON||n.id===t.geometryId&&t.type===m.Shape.types.TRIMESH||n.id===t.geometryId&&t.type===m.Shape.types.HEIGHTFIELD}(o,n)||(o&&e.remove(o),c[t]=o=b(n),a=!0),function(e,t){const{SPHERE:n,BOX:o,PLANE:s,CYLINDER:a,CONVEXPOLYHEDRON:r,TRIMESH:c,HEIGHTFIELD:l}=m.Shape.types;switch(t.type){case n:{const{radius:n}=t;e.scale.set(n*i,n*i,n*i);break}case o:e.scale.copy(t.halfExtents),e.scale.multiplyScalar(2*i);break;case s:break;case a:case r:e.scale.set(1*i,1*i,1*i);break;case c:e.scale.copy(t.scale).multiplyScalar(i);break;case l:e.scale.set(1*i,1*i,1*i)}}(o,n),a}return f.translate(0,0,1e-4),{update:function(){const n=c,o=d,i=h;let s=0;for(const e of t.bodies)for(let t=0;t!==e.shapes.length;t++){const c=e.shapes[t],l=w(s,c),d=n[s];d&&(e.quaternion.vmult(e.shapeOffsets[t],o),e.position.vadd(o,o),e.quaternion.mult(e.shapeOrientations[t],i),d.position.copy(o),d.quaternion.copy(i),l&&a instanceof Function&&a(e,d,c),!l&&r instanceof Function&&r(e,d,c)),s++}for(let t=s;t<n.length;t++){const o=n[t];o&&e.remove(o)}n.length=s}}}(M,v,{onUpdate:(e,t)=>{1==be.settings.physic_debug?t.visible=!0:t.visible=!1}});function Se(){let e=document.querySelector("#countdown-current-value");if(e.style.opacity=1,D||(de.fov=55,de.updateProjectionMatrix(),D=!0,N.to(de.position,{x:b[Y].mesh.position.x-30,y:b[Y].mesh.position.y+15,z:b[Y].mesh.position.z,duration:2,onUpdate:function(){de.lookAt(b[Y].mesh.position.x,b[Y].mesh.position.y,b[Y].mesh.position.z)},onComplete:function(){console.log("Camera behind the robot ---\x3e complete"),N.clear()}})),U)for(let e=0;e<b.length;e++)b[e].mixer.stopAllAction();else countDownStarted=!0,N.to(e,{duration:4.5,onUpdate:function(){var e,t;e=N.time(),t=document.querySelector("#countdown-current-value"),document.querySelector("#start-game").style.display="none",t&&(e>1&&e<2&&(t.innerHTML="3",Q.isPlaying||ne[0]||1!=be.settings.sound_enabled||(Q.play(),ne[0]=!0)),e>=2&&e<3&&(t.innerHTML="2",Q.isPlaying||ne[1]||1!=be.settings.sound_enabled||(Q.play(),ne[1]=!0)),e>3&&e<4&&(t.innerHTML="1",Q.isPlaying||ne[2]||1!=be.settings.sound_enabled||(Q.play(),ne[2]=!0)),e>=4&&(t.innerHTML="VIA",J.isPlaying||ne[3]||1!=be.settings.sound_enabled||(J.play(),ne[3]=!0)))},onComplete:function(){console.log("Countdown ---\x3e complete"),U=!0}})}function Ee(){!function(){b[Y].mesh.position.setX(b[Y].mesh.position.x+b[Y].speed),"third_person"==be.gameConstants.camera_view?(de.position.setX(b[be.gameConstants.indexCameraFollows].mesh.position.x-30),de.position.setZ(b[be.gameConstants.indexCameraFollows].mesh.position.z)):(de.position.setX(b[be.gameConstants.indexCameraFollows].mesh.position.x+50),de.position.setY(b[be.gameConstants.indexCameraFollows].mesh.position.y+20),de.position.setZ(50));de.lookAt(b[be.gameConstants.indexCameraFollows].mesh.position.x,b[be.gameConstants.indexCameraFollows].mesh.position.y,b[be.gameConstants.indexCameraFollows].mesh.position.z),ue.target.set(b[be.gameConstants.indexCameraFollows].mesh.position.x,b[be.gameConstants.indexCameraFollows].mesh.position.y,b[be.gameConstants.indexCameraFollows].mesh.position.z)}();for(let e=0;e<b.length;e++)e!=Y&&Le(e);X=((new Date-B)/1e3).toFixed(2),document.querySelector("#competition-timer-value").innerHTML="Timer : "+X+"s",function(){if(!re)for(let e=0;e<b.length;e++)b[e].mesh.position.x>=120&&(re=!0,ce=e,winnerTimer=X,_e(),I="winner")}()}function Le(e){e!=Y&&(b[e].mesh.position.setX(b[e].mesh.position.x+b[e].speed),b[e].physicsBody.position.x=b[e].physicsBody.position.x+b[e].speed)}var xe=!1;function Ae(e){-1!=z.filter((e=>1==e.is_spawned)).findIndex((t=>t.physicsBody.id==e.body.id))&&(0==xe&&b[Y].speed>.1?(b[Y].speed-=.03,console.log("diminuisco la velocita --\x3e",b[Y].speed)):xe=!0)}function _e(){for(let e=0;e<b.length;e++)b[e].mixer.stopAllAction();document.querySelector(".winner-screen").classList.remove("d-none"),document.querySelector(".message.competition-timer").classList.add("d-none"),ce==Y?(document.querySelector(".lost-container").classList.add("d-none"),document.querySelector("#winner-screen-message").innerHTML="YOU WON!",document.querySelector("#winner-time").classList.add("d-none"),document.querySelector("#your-time").innerHTML="Your time: <b>"+X+"s</b>"):(document.querySelector(".trofeo-container").classList.add("d-none"),document.querySelector("#winner-screen-message").innerHTML="YOU LOST!",document.querySelector("#winner-time").innerHTML="Winner time: <b>"+X+"s</b>",document.querySelector("#your-time").classList.add("d-none"))}function Oe(){switch(v.step(w),TWEEN.update(),ve.update(),I){case"spawning":document.querySelector(".message-spawning").classList.remove("d-none"),function(e,t){if(!se){se=!0,console.log("Spawning ostacoli ...."),e.clear();const s=20;var n={x:0,y:0,z:0},o=300,i=be.gameConstants.spawnAnimationCameraDuration;e.to(de.position,{x:n.x+o,y:200,z:n.z,duration:i/4,ease:"circ.out",onUpdate:function(){de.fov=180,de.lookAt(0,0,0)}}).to(de.position,{x:n.x,y:200,z:n.z-o,duration:i/4,ease:"circ.out",onUpdate:function(){de.fov=180,de.lookAt(0,0,0)}}).to(de.position,{x:n.x-o,y:200,z:n.z,duration:i/4,ease:"circ.out",onUpdate:function(){de.fov=180,de.lookAt(0,0,0)}}).to(de.position,{x:n.x,y:200,z:n.z+o,duration:i/4,ease:"circ.out",onUpdate:function(){de.fov=180,de.lookAt(0,0,0)},onComplete:function(){ae=!0,console.log("Camera spawning finished")}});let a=[];for(let e=0;e<t;e++){let e=Math.floor(201*Math.random())+-100;for(;Re(e,a,s);)e=Math.floor(201*Math.random())+-100;a.push(e);let t=new(0,y.Obstacle)(M,v,e,40,0,!0);z.push(t)}}}(N,E.spawnAmount),1==se&&1==ae&&(document.querySelector(".message-spawning").classList.add("d-none"),I="competition",console.log("Move to competition state"));break;case"competition":if(U){!function(){let e=document.querySelector(".countdown-competition");e&&e.classList.add("hide-animation"),setTimeout((function(){e.remove()}),3e3)}(),document.querySelector(".competition-timer").style.display="block",B=Date.now();for(let e=0;e<b.length;e++)b[e].runningClip();I="running"}else Se();break;case"running":Ee()}Pe(pe,ye),Pe(q,F),y.Obstacle.loaded&&Pe(z);const e=oe.getDelta();if(h.Robot.loaded)for(let t=0;t<b.length;t++)b[t].linkMeshAndBody(),b[t].updateMixer(e);le.render(M,de)}function Ce(e){if(h.Robot.loaded&&(!function(){for(let e=0;e<be.gameConstants.num_robots;e++)b.push(new(0,h.Robot)(M,v,-125,.1,15*e-30)),e==Y&&(b[e].is_my_robot=!0)}(),function(){for(let e=0;e<b.length;e++)e==Y?(b[e].speed=V,b[e].backup_speed=V,b[e].initial_speed=V):(b[e].speed=Math.random()*(.3-.1)+.1,b[e].initial_speed=b[e].speed,b[e].backup_speed=b[e].speed)}(),de.position.set(b[be.gameConstants.indexCameraFollows].mesh.position.x+30,b[be.gameConstants.indexCameraFollows].mesh.position.y+14,b[be.gameConstants.indexCameraFollows].mesh.position.z),de.lookAt(b[be.gameConstants.indexCameraFollows].mesh.position.x,b[be.gameConstants.indexCameraFollows].mesh.position.y,b[be.gameConstants.indexCameraFollows].mesh.position.z),ue.target.set(b[be.gameConstants.indexCameraFollows].mesh.position.x,b[be.gameConstants.indexCameraFollows].mesh.position.y,b[be.gameConstants.indexCameraFollows].mesh.position.z)),function(e,t,n){let o=null;e.load(x.href,(function(e){o=e.scene.children[0],M.add(o),o.traverse((function(e){e.isMesh&&(e.castShadow=!0)})),o.scale.set(8,8,8),o.position.set(-130,.1,-30),o.rotation.set(0,Math.PI/2,0);if(o)for(let e=0;e<t;e++){const t=o.clone();t.position.set(t.position.x,t.position.y,t.position.z+15*e),M.add(t)}}),void 0,(function(e){console.log(e)}))}(e,5),function(e,t){let n=null;e.load(C.href,(function(e){n=e.scene.children[0],M.add(n),n.traverse((function(e){e.isMesh&&(e.castShadow=!0)})),n.scale.set(3,3,3),n.rotation.set(0,Math.PI/2,0),n&&(Me(n,-120,.2,-35,2,51),Me(n.clone(),-120,.2,-19.7,2,51,{x:2.7}),Me(n.clone(),-120,.2,-4.7,2,51,{x:2.7}),Me(n.clone(),-120,.2,10.5,2,51,{x:2.7}),Me(n.clone(),-120,.2,25.5,2,51,{x:2.7}))}),void 0,(function(e){console.log(e)}))}(e),function(e,t,n,o){let i;e.load(_.href,(function(e){i=e.scene.children[0],i.position.set(-130,0,-37,5),i.scale.set(5,5,5),M.add(i);const o=15;if(i){for(let e=0;e<n;e++)for(let n=0;n<t;n++){const t=i.clone();t.position.set(t.position.x+7*n,0,t.position.z+e*o),q.push(t),M.add(t);const a=(new s.Box3).setFromObject(i),r=new m.Vec3;r.x=Math.abs(a.max.x-a.min.x),r.y=Math.abs(a.max.y-a.min.y),r.z=Math.abs(a.max.z-a.min.z);const c=new m.Box(r),l=new m.Body({mass:30,shape:c,position:new m.Vec3(t.position.x,t.position.y,t.position.z),type:m.Body.STATIC});v.addBody(l),F.push(l)}console.log("Walls added to the scene")}}))}(e,38,6),h.Robot.loaded){for(let e=0;e<b.length;e++)e==Y?(console.log("adding collision handler to my robot"),b[e].physicsBody.addEventListener("collide",Ae)):(console.log("adding collision handler to robot "+e),b[e].physicsBody.addEventListener("collide",(function(t){b[e].jumpAnimation(),b[e].speed=b[e].backup_speed,console.log("Set speed to "+b[e].speed)})));I="waitingForSpawn"}}function Me(e,t,n,o,i,s,a={}){const{x:r=3,y:c=3,z:l=3}=a;e.scale.set(r,c,l),e.position.set(t,n,o);for(let t=0;t<i;t++)for(let n=0;n<s;n++){const o=e.clone();o.position.set(o.position.x+5*n,o.position.y,o.position.z+10*t),M.add(o)}}requestAnimationFrame(Oe),le.setAnimationLoop(Oe),window.addEventListener("resize",(function(){de.aspect=window.innerWidth/window.innerHeight,de.updateProjectionMatrix(),le.setSize(window.innerWidth,window.innerHeight)}));var Te=new s.Mesh(new s.PlaneGeometry(3,3),new s.MeshBasicMaterial({side:s.DoubleSide,transparent:!1}));function ke(e){const t=new s.Vector2,n=new s.Raycaster;if(t.x=e.clientX/window.innerWidth*2-1,t.y=-e.clientY/window.innerHeight*2+1,n.setFromCamera(t,de),(ie=n.intersectObject(pe)).length>0){const e=ie[0],t=(new s.Vector3).copy(e.point).floor();Te.position.set(t.x,.1,t.z);const n=z.find((function(e){return e.mesh.position.x+3>=Te.position.x&&e.mesh.position.x-3<Te.position.x&&e.mesh.position.z+3>=Te.position.z&&e.mesh.position.z-3<Te.position.z})),o=He(Te.position.x,Te.position.z);!n&&o?Te.material.color.setHex(16777215):Te.material.color.setHex(16711680)}}function He(e,t){return(30==t||15==t||-15==t||-30==t)&&!(e<-100||e>100)}function Re(e,t,n){for(let o=0;o<t.length;o++)if(Math.abs(e-t[o])<n)return!0;return!1}function Pe(e,t){if(null!=t){if(e.length!=t.length&&null!=t)return console.log("Error linking meshes and bodies"),console.log("Meshes: "+e.length),void console.log("Bodies: "+t.length)}else if(e.length>0)for(let n=0;n<e.length;n++)e[n]instanceof y.Obstacle?(e[n].mesh.position.copy(e[n].physicsBody.position),e[n].mesh.position.y-=y.Obstacle.yBodyDisplacement,e[n].mesh.quaternion.copy(e[n].physicsBody.quaternion)):t[n]&&(e[n].position.copy(t[n].position),e[n].quaternion.copy(t[n].quaternion))}Te.rotateX(-Math.PI/2),Te.material.color.setHex(255),M.add(Te),window.onload=function(){Ce(k),document.querySelector("#cash-value").innerHTML=S;new Swiper(".swiper-container",{direction:"horizontal",loop:!0,pagination:{el:".swiper-pagination"},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}})},document.querySelector("#start-game").addEventListener("click",(function(){document.querySelector(".container-button-settings").classList.remove("d-none"),S>0&&alert("You are starting the game but you didn't spend all of your budget! \nThis will make the others robot life easier!"),1==be.settings.sound_enabled&&te.play(),I="spawning",de.fov=20,de.updateProjectionMatrix(),document.querySelector("#start-game").style.display="none",document.querySelector(".initial-screen").style.display="none",document.querySelector("#space-img").classList.remove("d-none"),u.default.to("#space-img",{opacity:0,duration:be.gameConstants.buttonsInstructionsFadeDuration,onComplete:function(){document.querySelector("#space-img").style.display="none"}}),document.querySelector("#shift-img").classList.remove("d-none"),u.default.to("#shift-img",{opacity:0,duration:be.gameConstants.buttonsInstructionsFadeDuration,onComplete:function(){document.querySelector("#space-img").style.display="none"}})})),document.querySelector("#release-obstacle").addEventListener("click",(function(){!0?(console.log("enter release mode hide initial screen"),document.querySelector("body").classList.add("pencil-cursor"),document.querySelector(".release-mode-container").classList.remove("d-none"),document.querySelector("#release-obstacle").setAttribute("enabled","true"),document.querySelector(".initial-screen").classList.add("d-none")):(document.querySelector(".initial-screen").classList.remove("d-none"),document.querySelector("body").classList.remove("pencil-cursor"),document.querySelector("#release-obstacle").setAttribute("enabled","false")),document.querySelector(".current-cash-container").classList.toggle("d-none"),function(e){let t=document.querySelector("#release-obstacle").getAttribute("enabled");console.log("Release mode: ",t),"false"==t?M.remove(Te):(M.add(Te),window.addEventListener("mousemove",ke),window.addEventListener("mousedown",(function(){var e=document.querySelector("#cash-value");const t=z.find((function(e){return e.mesh.position.x+3>=Te.position.x&&e.mesh.position.x-3<Te.position.x&&e.mesh.position.z+3>=Te.position.z&&e.mesh.position.z-3<Te.position.z}));if(t){let n=z.findIndex((e=>e.mesh.uuid===t.mesh.uuid));-1!=n&&(v.removeBody(z[n].physicsBody),M.remove(z[n].mesh),1==be.settings.sound_enabled&&ee.play(),console.log("Obstacle array before remove: ",z),z=z.slice(0,n).concat(z.slice(n+1)),console.log("Obstacle array after remove: ",z),Te.material.color.setHex(16777215),S+=10,document.querySelector("#budget-finished").classList.add("d-none"),e.innerHTML=S)}else if(S>=10){if(ie.length>0&&He(Te.position.x,Te.position.z)){let t=new(0,y.Obstacle)(M,v,Te.position.x,Te.position.y,Te.position.z,!1);1==be.settings.sound_enabled&&$.play(),S-=10,e.innerHTML=S,z.push(t),console.log("Ostacoli inseriti-> ",z.length)}}else{let e=document.querySelector("#budget-finished");e.classList.remove("d-none"),e.style.opacity=1,new TWEEN.Tween(e.style.opacity).to(0,1e3).onComplete((function(){document.querySelector("#budget-finished").classList.add("d-none")})).start()}})))}()})),document.querySelector("#release-mode-exit").addEventListener("click",(function(){console.log("exit release mode"),document.querySelector("#budget-finished").classList.add("d-none"),!1||(document.querySelector(".initial-screen").classList.remove("d-none"),document.querySelector("body").classList.remove("pencil-cursor"),document.querySelector(".release-mode-container").classList.add("d-none"),document.querySelector("#release-obstacle").setAttribute("enabled","false")),document.querySelector(".current-cash-container").classList.toggle("d-none")})),document.querySelector("#how-it-works").addEventListener("click",(function(){document.querySelector(".initial-screen").classList.add("d-none"),document.querySelector(".how-it-works-container").classList.remove("d-none")})),document.querySelector("#how-it-works-exit").addEventListener("click",(function(){document.querySelector(".initial-screen").classList.remove("d-none"),document.querySelector(".how-it-works-container").classList.add("d-none")})),document.querySelector("#play-again").addEventListener("click",(function(){location.reload()})),document.querySelector("#settings-button").addEventListener("click",(function(){document.querySelector(".initial-screen").classList.add("d-none"),document.querySelector(".settings-container").classList.remove("d-none")})),document.querySelector("#settings-button").addEventListener("mouseenter",(function(){document.querySelector("#settings-button").classList.add("fa-spin")})),document.querySelector("#settings-button").addEventListener("mouseleave",(function(){document.querySelector("#settings-button").classList.remove("fa-spin")})),document.querySelectorAll('input[name="camera-view"]').forEach((function(e){e.addEventListener("change",(function(){be.gameConstants.camera_view=this.value,console.log("camera view changed to "+be.gameConstants.camera_view)}))})),document.querySelectorAll('input[name="debug"]').forEach((function(e){e.addEventListener("change",(function(){"true"==this.value?be.settings.physic_debug=!0:be.settings.physic_debug=!1,console.log("debug changed to "+be.settings.physic_debug)}))})),document.querySelectorAll('input[name="audio"]').forEach((function(e){e.addEventListener("change",(function(){"true"==this.value?be.settings.sound_enabled=!0:be.settings.sound_enabled=!1}))})),document.querySelector("#change-camera-view").addEventListener("click",(function(){"third_person"==be.gameConstants.camera_view?be.gameConstants.camera_view="whole_view":be.gameConstants.camera_view="third_person"})),document.querySelector("#change-sound").addEventListener("click",(function(){be.settings.sound_enabled=!be.settings.sound_enabled})),document.querySelector("#settings-exit").addEventListener("click",(function(){document.querySelector(".initial-screen").classList.remove("d-none"),document.querySelector(".settings-container").classList.add("d-none")})),document.addEventListener("keydown",(function(e){if("running"==I){var t=e.which;if(16==t)we.shift||"running"!=I||b[Y].jumpAnimation(),we.shift=!0;else if(32==t){let e=z.filter((e=>1==e.is_spawned));we.space||"running"!=I||b[Y].punchAnimation(null,e,M,v),we.space=!0}}}),!1),document.addEventListener("keyup",(function(e){if("running"==I){var t=e.which;16==t?we.shift=!1:32==t&&(we.space=!1)}}),!1);
//# sourceMappingURL=index.11656f31.js.map
